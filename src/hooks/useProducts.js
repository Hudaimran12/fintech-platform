import { useState, useEffect } from "react";
import { transformAll } from "../utils/transform";
import { LOCAL_PRODUCTS } from "../utils/localProducts";

export function useProducts() {
  const [products, setProducts] = useState(LOCAL_PRODUCTS); // start with local
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch("https://fakestoreapi.com/products")
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          const apiProducts = transformAll(data);
          // Merge local + API, avoiding name duplicates
          const merged = [
            ...LOCAL_PRODUCTS,
            ...apiProducts.filter(
              (ap) => !LOCAL_PRODUCTS.some((lp) => lp.name === ap.name)
            ),
          ];
          setProducts(merged);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
}
