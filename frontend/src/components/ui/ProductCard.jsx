import { ShoppingCart, Heart } from 'lucide-react';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { name, description, price, volume, image, inStock } = product;

  return (
    <div className="product-card">
      <div className="product-card__img-wrap">
        <img src={image} alt={name} className="product-card__img" loading="lazy" />
        <div className="product-card__overlay">
          <button className="product-card__wishlist" aria-label="Wishlist">
            <Heart size={16} />
          </button>
        </div>
        {!inStock && <div className="product-card__oos">Out of Stock</div>}
      </div>

      <div className="product-card__body">
        <div>
          <h3 className="product-card__name">{name}</h3>
          {volume && <p className="product-card__volume">{volume}</p>}
          {description && <p className="product-card__desc">{description}</p>}
        </div>
        <div className="product-card__footer">
          <span className="product-card__price">${price.toFixed(2)}</span>
          <button className="btn btn-primary product-card__cta" disabled={!inStock}>
            <ShoppingCart size={15} />
            {inStock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
