import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

/* ──────────────────────────────────────────
   Skeleton Card — shown while loading
   ────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-surface-card border border-border rounded-2xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-surface-input" />
      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        <div className="h-4 bg-surface-input rounded-lg w-3/4" />
        <div className="h-3 bg-surface-input rounded-lg w-full" />
        <div className="h-3 bg-surface-input rounded-lg w-2/3" />
        <div className="flex items-center justify-between pt-3 border-t border-border mt-4">
          <div className="h-6 bg-surface-input rounded-lg w-20" />
          <div className="h-10 bg-surface-input rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Error Fallback — shown when backend is down
   ────────────────────────────────────────── */
function ErrorFallback({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 bg-danger-bg rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">Unable to Load Products</h2>
      <p className="text-text-secondary text-center max-w-md mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
        Try Again
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────
   Empty State — no products exist yet
   ────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">No Products Yet</h2>
      <p className="text-text-secondary text-center max-w-md">
        The store is empty. Products will appear here once an admin adds them.
      </p>
    </div>
  );
}



/* ══════════════════════════════════════════
   HOME PAGE — Main Component
   ══════════════════════════════════════════ */
export default function Home() {
  const { user, logout } = useAuth();
  const { totalCartItems } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 12;

  const fetchProducts = useCallback(async (pageNum = 0) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/api/products', {
        params: { page: pageNum, size: pageSize, sort: 'id,desc' },
      });
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setPage(pageNum);
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || !err.response) {
        setError('The server appears to be offline. Please ensure the backend is running on localhost:8080.');
      } else {
        setError(err.response?.data?.message || 'Failed to load products. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(0);
  }, [fetchProducts]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Navigation Bar ─────────────────────── */}
      <nav className="border-b border-border bg-surface-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-text-primary">ShopHub</span>
            </div>

            {/* Right side — Cart icon + User + Logout */}
            <div className="flex items-center gap-3">
              {/* Cart Button */}
              <Link 
                to="/cart"
                className="relative p-2 text-text-secondary hover:text-primary rounded-lg hover:bg-surface-input cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white ring-2 ring-surface-card">
                    {totalCartItems}
                  </span>
                )}
              </Link>

              {/* Admin Console Link */}
              {user?.role === 'ROLE_ADMIN' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Admin Console
                </Link>
              )}

              {/* My Orders Link */}
              <Link
                to="/orders"
                className="px-3 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary border border-border hover:bg-surface-input rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
                My Orders
              </Link>

              {/* User Info */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="text-text-primary font-medium">{user?.username}</p>
                  <p className="text-text-muted text-xs">{user?.role?.replace('ROLE_', '')}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-danger hover:bg-danger-bg rounded-lg cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main Content ───────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Our Products</h1>
            {!loading && !error && (
              <p className="text-text-secondary mt-1">
                {totalElements} {totalElements === 1 ? 'product' : 'products'} available
              </p>
            )}
          </div>
        </div>

        {/* ── Error State ──── */}
        {error && !loading && (
          <ErrorFallback message={error} onRetry={() => fetchProducts(page)} />
        )}

        {/* ── Loading Skeleton Grid ──── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Products Grid ──── */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* ── Pagination ──── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => fetchProducts(page - 1)}
                  disabled={page === 0}
                  className="px-4 py-2 text-sm font-medium bg-surface-card border border-border rounded-xl text-text-secondary hover:text-text-primary hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchProducts(i)}
                    className={`w-10 h-10 text-sm font-medium rounded-xl cursor-pointer transition-all ${
                      i === page
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-surface-card border border-border text-text-secondary hover:text-text-primary hover:border-primary/50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => fetchProducts(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 text-sm font-medium bg-surface-card border border-border rounded-xl text-text-secondary hover:text-text-primary hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Empty State ──── */}
        {!loading && !error && products.length === 0 && <EmptyState />}
      </main>

    </div>
  );
}
