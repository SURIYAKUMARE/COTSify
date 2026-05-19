"""Google Custom Search API service for finding component prices and product info."""
import httpx
from typing import List, Optional
from app.core.config import settings

SEARCH_URL = "https://www.googleapis.com/customsearch/v1"

# Indian e-commerce sites to search
SHOPPING_SITES = [
    "amazon.in",
    "flipkart.com",
    "robu.in",
    "electronicscomp.com",
    "quartzcomponents.com",
]


async def google_search_products(query: str, num: int = 5) -> List[dict]:
    """Search Google Custom Search for product listings."""
    if not settings.GOOGLE_SEARCH_API_KEY or not settings.GOOGLE_SEARCH_ENGINE_ID:
        return []

    if settings.GOOGLE_SEARCH_ENGINE_ID == "mock_id":
        import random
        base_price = random.randint(100, 1500)
        return [
            {
                "title": f"{query} - Best Price on Amazon",
                "link": f"https://www.amazon.in/s?k={query.replace(' ', '+')}",
                "snippet": f"Buy {query} online at best prices in India. Free shipping available.",
                "platform": "Amazon",
                "price": base_price + random.randint(10, 50),
                "image": None,
            },
            {
                "title": f"Buy {query} Online - Flipkart.com",
                "link": f"https://www.flipkart.com/search?q={query.replace(' ', '+')}",
                "snippet": f"Great discounts on {query}. Shop from a wide range of electronic components.",
                "platform": "Flipkart",
                "price": base_price + random.randint(5, 45),
                "image": None,
            },
            {
                "title": f"{query} - Robu.in | Indian Robotics Store",
                "link": f"https://robu.in/?s={query.replace(' ', '+')}",
                "snippet": f"Original {query} available in stock. Order now for fast delivery.",
                "platform": "Robu.in",
                "price": base_price - random.randint(10, 30),
                "image": None,
            },
            {
                "title": f"{query} - ElectronicsComp",
                "link": f"https://www.electronicscomp.com/search?q={query.replace(' ', '+')}",
                "snippet": f"Get {query} at wholesale prices. High quality components for makers.",
                "platform": "ElectronicsComp",
                "price": base_price + random.randint(0, 20),
                "image": None,
            }
        ][:num]

    try:
        # Build site-restricted query for Indian e-commerce
        site_query = " OR ".join([f"site:{s}" for s in SHOPPING_SITES[:3]])
        full_query = f"{query} buy price INR ({site_query})"

        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(SEARCH_URL, params={
                "key": settings.GOOGLE_SEARCH_API_KEY,
                "cx": settings.GOOGLE_SEARCH_ENGINE_ID,
                "q": full_query,
                "num": num,
                "gl": "in",          # India
                "hl": "en",
                "safe": "active",
            })
            data = resp.json()

        results = []
        for item in data.get("items", []):
            # Extract price from snippet if available
            snippet = item.get("snippet", "")
            title = item.get("title", "")
            link = item.get("link", "")
            display_link = item.get("displayLink", "")

            # Detect platform
            platform = "Web"
            if "amazon" in display_link: platform = "Amazon"
            elif "flipkart" in display_link: platform = "Flipkart"
            elif "robu" in display_link: platform = "Robu.in"
            elif "electronicscomp" in display_link: platform = "ElectronicsComp"
            elif "quartz" in display_link: platform = "QuartzComponents"

            # Try to extract price from snippet
            price = _extract_price(snippet + " " + title)

            results.append({
                "title": title,
                "link": link,
                "snippet": snippet,
                "platform": platform,
                "price": price,
                "image": item.get("pagemap", {}).get("cse_image", [{}])[0].get("src"),
            })

        return results

    except Exception as e:
        print(f"Google Search error: {e}")
        return []


async def google_search_general(query: str, num: int = 5) -> List[dict]:
    """General Google search for component info, tutorials, datasheets."""
    if not settings.GOOGLE_SEARCH_API_KEY or not settings.GOOGLE_SEARCH_ENGINE_ID:
        return []

    if settings.GOOGLE_SEARCH_ENGINE_ID == "mock_id":
        return [
            {
                "title": f"{query} - Wikipedia",
                "link": "https://en.wikipedia.org/wiki/Electronic_component",
                "snippet": f"Information about {query} and its applications in electronic circuits.",
                "display_link": "en.wikipedia.org",
            },
            {
                "title": f"Datasheet for {query}",
                "link": "https://www.alldatasheet.com/",
                "snippet": f"Download the official datasheet and technical specifications for {query}.",
                "display_link": "www.alldatasheet.com",
            },
            {
                "title": f"How to use {query} - Tutorial",
                "link": "https://www.instructables.com/",
                "snippet": f"Step-by-step guide on how to wire and program {query} with Arduino.",
                "display_link": "www.instructables.com",
            }
        ][:num]

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(SEARCH_URL, params={
                "key": settings.GOOGLE_SEARCH_API_KEY,
                "cx": settings.GOOGLE_SEARCH_ENGINE_ID,
                "q": query,
                "num": num,
                "gl": "in",
                "hl": "en",
            })
            data = resp.json()

        return [
            {
                "title": item.get("title", ""),
                "link": item.get("link", ""),
                "snippet": item.get("snippet", ""),
                "display_link": item.get("displayLink", ""),
            }
            for item in data.get("items", [])
        ]
    except Exception as e:
        print(f"Google Search error: {e}")
        return []


def _extract_price(text: str) -> Optional[float]:
    """Extract INR price from text."""
    import re
    # Match patterns like ₹649, Rs.649, INR 649, 649.00
    patterns = [
        r'₹\s*(\d+(?:,\d+)*(?:\.\d+)?)',
        r'Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)',
        r'INR\s*(\d+(?:,\d+)*(?:\.\d+)?)',
        r'(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:INR|Rs)',
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            price_str = match.group(1).replace(",", "")
            try:
                return float(price_str)
            except ValueError:
                continue
    return None
