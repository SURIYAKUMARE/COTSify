"""Google-powered search endpoint for COTsify."""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from app.services.google_search_service import (
    google_search_products,
    google_search_general,
)
from app.core.config import settings

router = APIRouter()


class SearchResult(BaseModel):
    title: str
    link: str
    snippet: str
    platform: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    display_link: Optional[str] = None


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total: int
    source: str  # "google" | "fallback"


@router.get("/products", response_model=SearchResponse)
async def search_products(
    q: str = Query(..., min_length=1, description="Component or product to search"),
    num: int = Query(5, ge=1, le=10),
):
    """Search for component prices across Indian e-commerce platforms via Google."""
    if not settings.GOOGLE_SEARCH_API_KEY or not settings.GOOGLE_SEARCH_ENGINE_ID:
        # Return fallback with direct links
        fallback = _get_fallback_results(q)
        return SearchResponse(query=q, results=fallback, total=len(fallback), source="fallback")

    results = await google_search_products(q, num)
    if not results:
        fallback = _get_fallback_results(q)
        return SearchResponse(query=q, results=fallback, total=len(fallback), source="fallback")

    return SearchResponse(
        query=q,
        results=[SearchResult(**r) for r in results],
        total=len(results),
        source="google",
    )


@router.get("/web", response_model=SearchResponse)
async def search_web(
    q: str = Query(..., min_length=1, description="General search query"),
    num: int = Query(5, ge=1, le=10),
):
    """General Google web search for component info, tutorials, datasheets."""
    if not settings.GOOGLE_SEARCH_API_KEY or not settings.GOOGLE_SEARCH_ENGINE_ID:
        return SearchResponse(query=q, results=[], total=0, source="not_configured")

    results = await google_search_general(q, num)
    return SearchResponse(
        query=q,
        results=[SearchResult(**r) for r in results],
        total=len(results),
        source="google",
    )


@router.get("/status")
async def search_status():
    """Check if Google Search is configured."""
    configured = bool(settings.GOOGLE_SEARCH_API_KEY and settings.GOOGLE_SEARCH_ENGINE_ID)
    return {
        "configured": configured,
        "has_api_key": bool(settings.GOOGLE_SEARCH_API_KEY),
        "has_engine_id": bool(settings.GOOGLE_SEARCH_ENGINE_ID),
        "message": "Google Custom Search ready" if configured else "Add GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID to backend/.env",
    }


def _get_fallback_results(query: str) -> List[SearchResult]:
    """Return direct search links when Google API is not configured."""
    encoded = query.replace(" ", "+")
    return [
        SearchResult(
            title=f"{query} - Amazon India",
            link=f"https://www.amazon.in/s?k={encoded}",
            snippet=f"Search for {query} on Amazon India. Compare prices and read reviews.",
            platform="Amazon",
            price=None,
            image=None,
        ),
        SearchResult(
            title=f"{query} - Flipkart",
            link=f"https://www.flipkart.com/search?q={encoded}",
            snippet=f"Buy {query} on Flipkart. Best prices with fast delivery.",
            platform="Flipkart",
            price=None,
            image=None,
        ),
        SearchResult(
            title=f"{query} - Robu.in",
            link=f"https://robu.in/?s={encoded}",
            snippet=f"Find {query} at Robu.in - India's leading robotics and electronics store.",
            platform="Robu.in",
            price=None,
            image=None,
        ),
        SearchResult(
            title=f"{query} - ElectronicsComp",
            link=f"https://www.electronicscomp.com/search?q={encoded}",
            snippet=f"Shop {query} at ElectronicsComp. Wide range of electronic components.",
            platform="ElectronicsComp",
            price=None,
            image=None,
        ),
        SearchResult(
            title=f"Buy {query} - Google Shopping",
            link=f"https://www.google.com/search?q={encoded}+buy+price+india&tbm=shop",
            snippet=f"Compare prices for {query} across multiple Indian stores on Google Shopping.",
            platform="Google Shopping",
            price=None,
            image=None,
        ),
    ]
