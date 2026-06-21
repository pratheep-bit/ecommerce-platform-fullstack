import httpx
from typing import Optional, Dict, Any
from datetime import datetime
from decimal import Decimal

from app.core import settings, logger


class ShiprocketService:
    def __init__(self):
        self.base_url = settings.SHIPROCKET_API_URL or "https://apiv2.shiprocket.in/v1"
        self.email = settings.SHIPROCKET_EMAIL
        self.password = settings.SHIPROCKET_PASSWORD
        self.token: Optional[str] = None
        self.token_expiry: Optional[datetime] = None

    async def login(self) -> str:
        """Authenticate and get token."""
        if self.token and self.token_expiry and datetime.utcnow() < self.token_expiry:
            return self.token
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/external/auth/login",
                json={
                    "email": self.email,
                    "password": self.password
                }
            )
            
            if response.status_code != 200:
                logger.error(f"Shiprocket auth failed: {response.text}")
                raise Exception("Shiprocket authentication failed")
            
            data = response.json()
            self.token = data["token"]
            from datetime import timedelta
            self.token_expiry = datetime.utcnow() + timedelta(days=9)
            
            return self.token

    async def _request(self, method: str, endpoint: str, data: dict = None) -> dict:
        """Make authenticated request to Shiprocket API."""
        token = await self.login()
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            if method == "GET":
                response = await client.get(f"{self.base_url}{endpoint}", headers=headers, params=data)
            else:
                response = await client.request(method, f"{self.base_url}{endpoint}", headers=headers, json=data)
            
            if response.status_code not in [200, 201]:
                logger.error(f"Shiprocket API error: {response.text}")
                raise Exception(f"Shiprocket API error: {response.status_code}")
            
            return response.json()

    async def create_order(self, order_data: dict) -> dict:
        """Create an order in Shiprocket."""
        result = await self._request("POST", "/external/orders/create/adhoc", order_data)
        logger.info(f"Shiprocket order created: {result.get('order_id')}")
        return result

    async def generate_label(self, shipment_id: str):
        """Generate shipping label. Auto-selects courier."""
        data = {"shipment_id": [str(shipment_id)]}
        result = await self._request("POST", "/external/courier/generate/awb", data)
        return result

    async def track_shipment(self, awb: str):
        """Track shipment status."""
        result = await self._request("GET", f"/external/courier/track/awb/{awb}")
        return result
        
    async def schedule_pickup(self, shipment_id: str) -> dict:
        """Schedule pickup for shipment."""
        result = await self._request(
            "POST",
            "/external/courier/generate/pickup",
            {"shipment_id": [shipment_id]}
        )
        return result
        
    async def get_tracking_url(self, order_id: str) -> str:
        """Get public tracking URL for order."""
        return f"https://shiprocket.co/tracking/{order_id}"

shiprocket_service = ShiprocketService()

async def create_shipment(
    order_id: str,
    order_number: str,
    order_date: datetime,
    address: dict,
    items: list,
    subtotal: Decimal,
    shipping_charges: Decimal,
    dimensions: dict
) -> Dict[str, Any]:
    """Create shipment for an order using shiprocket_service."""
    try:
        order_items = []
        for item in items:
            order_items.append({
                "name": item["product_name"],
                "sku": str(item["product_id"]),
                "units": item["quantity"],
                "selling_price": float(item["price"]),
                "discount": 0,
                "tax": 0,
                "hsn": ""
            })
        
        order_data = {
            "order_id": order_number,
            "order_date": order_date.strftime("%Y-%m-%d %H:%M"),
            "pickup_location": "Primary",
            "billing_customer_name": address["name"],
            "billing_last_name": "",
            "billing_address": f"{address['line1']} {address.get('line2', '')}".strip(),
            "billing_city": address["city"],
            "billing_pincode": address["pincode"],
            "billing_state": address["state"],
            "billing_country": "India",
            "billing_email": "",
            "billing_phone": address["mobile"].lstrip("+91").lstrip("+"),
            "shipping_is_billing": True,
            "order_items": order_items,
            "payment_method": "Prepaid",
            "sub_total": float(subtotal),
            "shipping_charges": float(shipping_charges),
            "length": dimensions.get("length", 10),
            "breadth": dimensions.get("breadth", 10),
            "height": dimensions.get("height", 10),
            "weight": dimensions.get("weight", 0.5)
        }

        # Create order in Shiprocket
        result = await shiprocket_service.create_order(order_data)
        
        shiprocket_order_id = result.get("order_id")
        shipment_id = result.get("shipment_id")
        
        # Generate AWB (auto-select courier)
        awb_result = await shiprocket_service.generate_label(str(shipment_id))
        
        # Schedule pickup
        await shiprocket_service.schedule_pickup(str(shipment_id))
        
        return {
            "shiprocket_order_id": str(shiprocket_order_id),
            "shiprocket_shipment_id": str(shipment_id),
            "awb_number": awb_result.get("response", {}).get("data", {}).get("awb_code"),
            "courier_name": awb_result.get("response", {}).get("data", {}).get("courier_name"),
            "courier_id": awb_result.get("response", {}).get("data", {}).get("courier_company_id"),
            "tracking_url": await shiprocket_service.get_tracking_url(order_number)
        }
        
    except Exception as e:
        logger.error(f"Shipment creation failed: {e}")
        raise
