import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';

  return (
    <div className="group bg-surface-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 flex flex-col">
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-surface block">
        <img
          src={product.imageUrl || fallbackImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />

        {/* Stock Badge */}
        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500/90 text-white text-xs font-semibold rounded-lg backdrop-blur-sm">
            Only {product.stockQuantity} left
          </span>
        )}
        {product.stockQuantity === 0 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-danger/90 text-white text-xs font-semibold rounded-lg backdrop-blur-sm">
            Out of Stock
          </span>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-text-primary font-semibold text-base leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-text-muted text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>
        )}
        {!product.description && <div className="flex-1" />}

        {/* Price + Button Row */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-border">
          {/* Price */}
          <div>
            <span className="text-xl font-bold text-primary">
              ₹{Number(product.price).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Add to Cart or Qty Controls */}
          {cartItem ? (
            <div className="flex items-center gap-2 bg-surface-input rounded-xl p-1">
              <button
                onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                disabled={cartItem.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-surface-card rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-semibold">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                disabled={cartItem.quantity >= product.stockQuantity}
                className="w-8 h-8 flex items-center justify-center text-text-primary hover:bg-surface-card rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product.id, 1)}
              disabled={product.stockQuantity === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {product.stockQuantity === 0 ? 'Sold Out' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
