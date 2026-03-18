import React, { useState, useEffect, useContext } from 'react';
import { Search, MapPin, Sparkles, ShoppingCart, Star, Check, Award, Zap, Percent, Clock, ArrowRight, TrendingUp, Plus, X, Upload, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { LanguageContext } from '../context/LanguageContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { api } from '../config/api';

const DEMO_PRODUCTS = [
  // GROCERY
  { _id: 'p0', type: 'ai', name: 'AI Curated Gourmet Pack', category: 'grocery', price: 1299, rating: 5.0, vendorName: 'VyapaarSetu AI', vendorPhone: '919876543210', distance: 'Cloud', badge: '🤖 AI Recommended', description: 'Based on your healthy lifestyle preferences, this pack combines organic greens, quinoa, and cold-pressed juices.', images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'] },
  { _id: 'p3', type: 'nearby', name: 'Organic Spinach (250g)', category: 'grocery', price: 45, rating: 4.8, count: 156, vendorName: 'Green Farms', vendorPhone: '919876543211', distance: '📍 0.5 km away', badge: 'Nearby', description: 'Farm-fresh spinach, hydro-cooled for maximum crispness.', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400'] },
  { _id: 'p8', type: 'fast_delivery', name: 'Fresh Milk & Dairy Pack', category: 'grocery', price: 120, rating: 4.7, count: 412, vendorName: 'City Dairy', vendorPhone: '919876543212', distance: '0.2 km', badge: '⚡ Fast Delivery', deliveryTime: '8-12 mins', description: 'Farm-fresh milk and yogurt delivered to your doorstep in minutes.', images: ['https://images.unsplash.com/photo-1563636619-e9107daaf721?w=400'] },
  { _id: 'p10', type: 'discount', name: 'Himalayan Forest Honey', category: 'grocery', price: 399, oldPrice: 600, discount: '35% OFF', rating: 4.9, count: 201, vendorName: 'Nature\'s Best', vendorPhone: '919876543213', distance: '4.5 km', badge: 'Limited Offer', description: 'Pure, raw honey sourced from the deep forests of the Himalayas.', images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400'] },
  { _id: 'p13', type: 'bestseller', name: 'Artisanal Coffee Trio', category: 'grocery', price: 850, oldPrice: 1100, rating: 4.9, count: 520, vendorName: 'Bean Bliss', vendorPhone: '919876543214', distance: '2.4 km', badge: 'Best Seller ⭐', description: 'Three distinct single-origin roasts: Ethiopian, Colombian, and Sumatran.', images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'] },
  { _id: 'p17', type: 'standard', name: 'Organic Quinoa (1kg)', category: 'grocery', price: 450, rating: 4.8, count: 88, vendorName: 'Pure Bites', vendorPhone: '919876543215', distance: '5.2 km', description: 'Protein-rich white quinoa, triple-rinsed and ready to cook.', images: ['https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400'] },
  { _id: 'p30', type: 'standard', name: 'Premium Cashew Nuts (500g)', category: 'grocery', price: 850, rating: 4.9, count: 42, vendorName: 'Nutty Bites', vendorPhone: '919876543216', distance: '2.5 km', description: 'Jumbo-sized salted and roasted cashew nuts. Grade A quality.', images: ['https://images.unsplash.com/photo-1509461192376-0ec78ef0276a?w=400'] },
  
  // PHARMACY
  { _id: 'p2', type: 'fast_delivery', name: 'Pain Relief Medicine', category: 'pharmacy', price: 210, rating: 4.6, vendorName: 'LifeLine Meds', vendorPhone: '919876543217', distance: '0.3 km', badge: '⚡ Fast Delivery', deliveryTime: '10-15 mins', description: 'Fast-acting medicine for instant relief. Expert verified stock.', images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'] },
  { _id: 'p14', type: 'fast_delivery', name: 'Emergency First Aid XL', category: 'pharmacy', price: 1250, rating: 4.8, vendorName: 'QuickMeds', vendorPhone: '919876543218', distance: '0.6 km', badge: '⚡ Fast Delivery', deliveryTime: '12-18 mins', description: 'Comprehensive first aid kit with 100+ essential medical supplies.', images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400'] },
  { _id: 'p22', type: 'discount', name: 'Liquid Vitamin D3', category: 'pharmacy', price: 450, oldPrice: 700, discount: '35% OFF', rating: 4.8, vendorName: 'VitaHealth', vendorPhone: '919876543219', distance: '2.1 km', badge: 'Limited Offer', description: 'High-absorption liquid Vitamin D3, 5000 IU per serving.', images: ['https://images.unsplash.com/photo-1550572017-edd951b55104?w=400'] },
  { _id: 'p25', type: 'nearby', name: 'Digital Thermometer', category: 'pharmacy', price: 450, rating: 4.7, vendorName: 'MediQuick', vendorPhone: '919876543220', distance: '📍 0.3 km away', badge: 'Nearby', description: 'Highly accurate digital thermometer with 10-second reading.', images: ['https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400'] },
  { _id: 'p31', type: 'fast_delivery', name: 'Vitamin C Tablets (60pc)', category: 'pharmacy', price: 350, rating: 4.8, vendorName: 'HealWell Pharmacy', vendorPhone: '919876543221', distance: '1.2 km', badge: '⚡ Fast Delivery', deliveryTime: '15 mins', description: '500mg Vitamin C tablets for immunity support.', images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400'] },

  // BAKERY
  { _id: 'p1', type: 'bestseller', name: 'Chocolate Anniversary Cake', category: 'bakery', price: 1499, oldPrice: 1999, rating: 4.9, vendorName: 'Royal Patisserie', vendorPhone: '919876543222', distance: '1.2 km', badge: 'Best Seller ⭐', description: 'Three-layer Belgian chocolate cake with edible gold flakes. Best seller this season.', images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'] },
  { _id: 'p18', type: 'ai', name: 'Morning Bakery Fusion', category: 'bakery', price: 599, rating: 5.0, vendorName: 'VyapaarSetu AI', vendorPhone: '919876543210', distance: 'Cloud', badge: '🤖 AI Recommended', description: 'Predicted favorite: Warm croissants, sourdough, and blueberry muffins.', images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'] },
  { _id: 'p20', type: 'fast_delivery', name: 'Fresh French Baguette', category: 'bakery', price: 85, rating: 4.9, vendorName: 'Cloud Crust', vendorPhone: '919876543223', distance: '0.4 km', badge: '⚡ Fast Delivery', deliveryTime: '10-14 mins', description: 'Traditional crusty baguette, delivered warm within minutes.', images: ['https://images.unsplash.com/photo-1589367920969-ab8e050bbc04?w=400'] },
  { _id: 'p29', type: 'fast_delivery', name: 'Whole Wheat Bread Loaf', category: 'bakery', price: 65, rating: 4.7, vendorName: 'Daily Crust', vendorPhone: '919876543224', distance: '0.4 km', badge: '⚡ Fast Delivery', deliveryTime: '8-12 mins', description: 'Freshly baked 100% whole wheat bread loaf. Perfect for sandwiches.', images: ['https://images.unsplash.com/photo-1571506191039-65657aa1e24d?w=400'] },
  { _id: 'p35', type: 'discount', name: 'Red Velvet Muffin Box', category: 'bakery', price: 350, oldPrice: 500, discount: '30% OFF', rating: 4.8, vendorName: 'Sugar Bliss', vendorPhone: '919876543225', distance: '0.4 km', badge: 'Limited Offer', description: 'Box of 4 moist red velvet muffins with cream cheese frosting.', images: ['https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=400'] },

  // HARDWARE
  { _id: 'p4', type: 'discount', name: 'Professional Power Drill', category: 'hardware', price: 2499, oldPrice: 3500, discount: '30% OFF', rating: 4.7, vendorName: 'BuildRight Tools', vendorPhone: '919876543226', distance: '2.5 km', badge: 'Limited Offer', description: '800W corded power drill with multi-bit support.', images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400'] },
  { _id: 'p7', type: 'bestseller', name: 'Premium Toolset XL', category: 'hardware', price: 4999, oldPrice: 6500, rating: 5.0, vendorName: 'Master Hardware', vendorPhone: '919876543227', distance: '2.8 km', badge: 'Best Seller ⭐', description: 'Complete 150-piece toolset for home and professional use.', images: ['https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800'] },
  { _id: 'p12', type: 'ai', name: 'Smart Home Hub Pack', category: 'hardware', price: 8999, rating: 5.0, vendorName: 'VyapaarSetu AI', vendorPhone: '919876543210', distance: 'Cloud', badge: '🤖 AI Recommended', description: 'Automated lighting and security bundle optimized for your home layout.', images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=800'] },
  { _id: 'p21', type: 'nearby', name: 'Solid Pine Floating Shelf', category: 'hardware', price: 1599, rating: 4.7, vendorName: 'Wood Works', vendorPhone: '919876543228', distance: '📍 0.8 km away', badge: 'Nearby', description: 'Heavy-duty 24-inch floating shelf in natural pine finish.', images: ['https://images.unsplash.com/photo-1594438090230-601bf12f30ca?w=400'] },
  { _id: 'p26', type: 'discount', name: 'Electric Screwdriver Set', category: 'hardware', price: 1899, oldPrice: 2499, discount: '24% OFF', rating: 4.6, vendorName: 'DrillMaster', vendorPhone: '919876543229', distance: '2.8 km', badge: 'Limited Offer', description: 'Cordless electric screwdriver with 24-piece bit set.', images: ['https://images.unsplash.com/photo-1563200100-360699059e3b?w=400'] },
  { _id: 'p32', type: 'nearby', name: 'Safety Tool Kit', category: 'hardware', price: 1200, rating: 4.7, vendorName: 'BuildRight Tools', vendorPhone: '919876543226', distance: '📍 0.5 km away', badge: 'Nearby', description: 'Essential home safety kit with gloves, mask, and goggles.', images: ['https://images.unsplash.com/photo-1530124560677-bdaea027df01?w=400'] },

  // PRINTING
  { _id: 'p5', type: 'standard', name: 'Matte Business Cards', category: 'printing', price: 450, rating: 4.5, vendorName: 'Pixel Prints', vendorPhone: '919876543230', distance: '3.2 km', description: 'High-quality 300gsm matte finish business cards.', images: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400'] },
  { _id: 'p9', type: 'nearby', name: 'Wedding Invitation Cards', category: 'printing', price: 15, rating: 4.8, vendorName: 'Shree Print House', vendorPhone: '919876543231', distance: '📍 1.1 km away', badge: 'Nearby', description: 'Custom printed wedding cards with premium foil finishing.', images: ['https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400'] },
  { _id: 'p16', type: 'discount', name: 'Premium Glossy Flyers', category: 'printing', price: 1200, oldPrice: 1800, discount: '33% OFF', rating: 4.6, vendorName: 'Print Hub', vendorPhone: '919876543232', distance: '3.5 km', badge: 'Limited Offer', description: '500 high-quality A5 flyers with double-sided color printing.', images: ['https://images.unsplash.com/photo-1586075010633-2470acfd8e82?w=400'] },
  { _id: 'p19', type: 'bestseller', name: 'Modern Desk Organizer', category: 'printing', price: 699, oldPrice: 950, rating: 4.9, vendorName: 'Design Republic', vendorPhone: '919876543233', distance: '1.8 km', badge: 'Best Seller ⭐', description: 'Eco-friendly recycled card desk organizer with 5 compartments.', images: ['https://images.unsplash.com/photo-1591122947157-26bad3a117d2?w=800'] },
  { _id: 'p28', type: 'bestseller', name: 'Vinyl Laptop Stickers (50pc)', category: 'printing', price: 499, oldPrice: 699, rating: 4.8, vendorName: 'Pixel Prints', vendorPhone: '919876543230', distance: '0.9 km', badge: 'Best Seller ⭐', description: 'High-quality waterproof vinyl stickers in assorted designs.', images: ['https://images.unsplash.com/photo-1614741484742-990e66c9449f?w=400'] },
  { _id: 'p34', type: 'bestseller', name: 'Custom Photo Frame (A4)', category: 'printing', price: 899, oldPrice: 1200, rating: 4.9, vendorName: 'Pixel Prints', vendorPhone: '919876543230', distance: '3.2 km', badge: 'Best Seller ⭐', description: 'High-quality acrylic photo frame with wood base.', images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800'] },

  // POTS
  { _id: 'p6', type: 'ai', name: 'Designer Terracotta Vases', category: 'pots', price: 1800, rating: 4.9, vendorName: 'VyapaarSetu AI', vendorPhone: '919876543210', distance: 'Cloud', badge: '🤖 AI Recommended', description: 'Hand-picked pottery matching your recent search for home decor.', images: ['https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800'] },
  { _id: 'p11', type: 'standard', name: 'Ceramic Plant Pot', category: 'pots', price: 299, rating: 4.6, vendorName: 'EcoGreen Pottery', vendorPhone: '919876543234', distance: '2.5 km', description: 'Beautifully glazed ceramic pot for indoor succulents.', images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400'] },
  { _id: 'p15', type: 'nearby', name: 'Painted Clay Diya Set', category: 'pots', price: 199, rating: 4.7, vendorName: 'Local Crafts', vendorPhone: '919876543235', distance: '📍 0.2 km away', badge: 'Nearby', description: 'Set of 12 hand-painted traditional clay diyas for festive decor.', images: ['https://images.unsplash.com/photo-1605273752535-649f87fecd8e?w=400'] },
  { _id: 'p23', type: 'standard', name: 'Abstract Ceramic Plate', category: 'pots', price: 550, rating: 4.5, vendorName: 'Vivid Clay', vendorPhone: '919876543236', distance: '3.8 km', description: 'Hand-glazed decorative ceramic plate with abstract geometric patterns.', images: ['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400'] },
  { _id: 'p27', type: 'standard', name: 'Terracotta Wall Hanging', category: 'pots', price: 799, rating: 4.9, vendorName: 'Earthly Vases', vendorPhone: '919876543237', distance: '1.2 km', description: 'Detailed terracotta wall hanging piece for ethnic home decor.', images: ['https://images.unsplash.com/photo-1563297122-e42152862d51?w=400'] },
  { _id: 'p33', type: 'ai', name: 'Mini Succulent Pots Set', category: 'pots', price: 1500, rating: 5.0, vendorName: 'VyapaarSetu AI', vendorPhone: '919876543210', distance: 'Cloud', badge: '🤖 AI Recommended', description: 'Hand-picked trio of mini glazed pots matching your recent decor search.', images: ['https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?w=800'] },
  { _id: 'p35-sourdough', type: 'standard', name: 'Artisanal Multigrain Sourdough', category: 'bakery', price: 250, rating: 4.9, vendorName: 'The Crusty Loaf', vendorPhone: '919876543238', distance: '1.5 km', badge: 'Freshly Baked', description: 'Slow-fermented sourdough packed with flax, sunflower, and pumpkin seeds.', images: ['https://images.unsplash.com/photo-1585478259715-876a6a81fc08?w=800'] },
];

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [addedItems, setAddedItems] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCols = () => {
    if (windowWidth >= 1024) return 4;
    if (windowWidth >= 640) return 2;
    return 1;
  };

  const { t } = useContext(LanguageContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const CATEGORIES = ['All', 'Grocery', 'Pharmacy', 'Bakery', 'Hardware', 'Pots', 'Printing'];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async (keyword = '') => {
    setLoading(true);
    try {
      if (keyword) {
        const response = await api.search(keyword);
        const mapped = response.results.map(v => ({
          _id: `v${v.id}`,
          name: v.name,
          category: v.category.toLowerCase(),
          price: 999,
          rating: v.rating,
          vendorName: v.name,
          distance: v.distance,
          description: `Quality services from ${v.name}`,
          images: [v.img]
        }));
        setProducts([...mapped, ...DEMO_PRODUCTS]);
      } else {
        const response = await api.rankVendors();
        const mapped = response.map(v => ({
           _id: `v${v.id}`,
           name: v.name,
           category: v.category.toLowerCase(),
           price: 999,
           rating: v.rating,
           vendorName: v.name,
           distance: v.distance,
           description: `Top ranked local provider.`,
           images: [v.img]
        }));
        setProducts([...mapped, ...DEMO_PRODUCTS]);
      }
    } catch (error) {
      console.warn('API fallback to DEMO');
      setProducts(DEMO_PRODUCTS);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

  const handleSmartSearch = async () => {
    setLoading(true);
    try {
      const response = await api.search(searchQuery || 'trending');
      const mapped = response.results.map(v => ({
        _id: `v${v.id}`,
        name: v.name,
        category: v.category.toLowerCase(),
        price: 999,
        rating: v.rating,
        vendorName: v.name,
        distance: v.distance,
        description: response.ai_note,
        images: [v.img],
        badge: '🤖 AI Match'
      }));
      setProducts([...mapped, ...DEMO_PRODUCTS]);
    } catch (error) {
      console.warn('Smart re-rank failed');
    }
    setLoading(false);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProd = {
      name: formData.get('name'),
      category: formData.get('category').toLowerCase(),
      price: parseFloat(formData.get('price')),
      description: formData.get('description'),
      images: [formData.get('imageUrl') || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400'],
      vendorName: user?.businessName || user?.name || 'Local Vendor',
      vendorId: user?.uid,
      vendorPhone: formData.get('vendorPhone') || '+919876543210',
      rating: 5.0,
      distance: '📍 Nearby',
      type: formData.get('type') || 'standard',
      badge: formData.get('type') === 'discount' ? 'Limited Offer' : (formData.get('type') === 'fast_delivery' ? '⚡ Fast Delivery' : null),
      createdAt: new Date().toISOString()
    };

    if (!newProd.name || !newProd.price || !newProd.category) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...newProd,
        createdAt: serverTimestamp()
      });
      
      const productWithId = { ...newProd, _id: docRef.id };
      setProducts(prev => [productWithId, ...prev]);
      
      showToast('Product deployed to marketplace!');
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to add product.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchProducts(latitude, longitude, searchQuery);
        },
        (error) => console.error("Location error", error)
      );
    }
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedItems(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product._id]: false })), 1500);
  };

  const filteredProducts = products.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category?.toLowerCase() === activeCategory;
  });

  const getFillerCards = () => {
    const cols = getCols();
    if (cols <= 1) return []; // No filler needed on mobile

    let totalWeight = 0;
    const itemsToWeight = [...filteredProducts];
    
    // Inject "Add Product" virtual item for vendors at 3rd position (index 2)
    if (user?.role === 'vendor') {
      itemsToWeight.splice(2, 0, { _id: 'add-product-virtual', type: 'add-product' });
    }

    itemsToWeight.forEach(p => {
      // Bestseller and AI cards span 2 columns on screen >= md (768px). 
      if ((p.type === 'bestseller' || p.type === 'ai') && windowWidth >= 768) {
        totalWeight += 2;
      } else {
        totalWeight += 1;
      }
    });

    const remainder = totalWeight % cols;
    if (remainder === 0) return [];

    const fillCount = cols - remainder;
    const fillers = [];
    const fillerDetails = [
      { name: 'AI Recommended Pack', img: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800' },
      { name: 'Explore More Categories', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' },
      { name: 'Priority Network Access', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800' },
      { name: 'Smart Trade Analysis', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800' }
    ];

    for (let i = 0; i < fillCount; i++) {
      const details = fillerDetails[i % fillerDetails.length];
      fillers.push({
        _id: `filler-${activeCategory}-${i}`,
        type: 'filler',
        name: details.name,
        category: 'suggested',
        price: '---',
        rating: '5.0',
        vendorName: 'VyapaarSetu',
        distance: 'Smart Suggest',
        description: 'Synchronizing with your local trade patterns to provide optimal recommendations.',
        badge: '🤖 AI SUGGESTION',
        images: [details.img]
      });
    }
    return fillers;
  };

  const getDisplayItems = () => {
    const items = [...filteredProducts];
    if (user?.role === 'vendor') {
      // Insert at 3rd position (index 2)
      items.splice(2, 0, { 
        _id: 'add-product-virtual', 
        type: 'add-product',
        name: 'DEPLOY NEW ASSET',
        category: 'sys_ops',
        description: 'Initialize a new product injection into the VyapaarSetu commerce protocol.',
        badge: 'NEW NODE'
      });
    }
    return [...items, ...getFillerCards()];
  };

  const displayItems = getDisplayItems();

  const renderCard = (product) => {
    const isBestseller = product.type === 'bestseller';
    const isAI = product.type === 'ai';
    const isFiller = product.type === 'filler';
    const isAddProduct = product.type === 'add-product';
    const isDiscount = product.type === 'discount';
    const isNearby = product.type === 'nearby';
    const isFast = product.type === 'fast_delivery';

    if (isAddProduct) {
      return (
        <div 
          key="add-product-virtual"
          onClick={() => setShowAddModal(true)}
          className="group relative bg-brand-void rounded-[2rem] border-2 border-dashed border-brand-accent/20 hover:border-brand-accent/60 p-8 flex flex-col items-center justify-center text-center gap-6 cursor-pointer transition-all duration-500 hover:bg-brand-accent/5 shadow-xl hover:shadow-brand-accent/10 min-h-[400px]"
        >
          <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
          <div className="relative z-10 w-20 h-20 rounded-3xl bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20 group-hover:scale-110 transition-transform duration-500">
            <Plus size={40} className="text-brand-accent group-hover:rotate-90 transition-transform duration-500" strokeWidth={3} />
          </div>
          <div className="relative z-10">
            <h3 className="font-display font-black text-2xl mb-2 tracking-tighter text-brand-text group-hover:text-brand-accent transition-colors">INITIALIZE DEPLOYMENT</h3>
            <p className="font-mono text-[10px] text-brand-text/40 uppercase tracking-[0.2em] max-w-[180px]">Add new asset to the commerce grid</p>
          </div>
          <div className="relative z-10 mt-4 px-6 py-2 rounded-full border border-brand-accent/20 bg-brand-accent/5 text-brand-accent font-mono text-[10px] font-black tracking-widest group-hover:bg-brand-accent group-hover:text-brand-void transition-all">
            SCAN_NEW_PROTOCOL
          </div>
        </div>
      );
    }

    return (
      <div 
        key={product._id}
        className={`group relative bg-brand-card rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-brand-accent/40 shadow-xl hover:shadow-brand-accent/5 flex flex-col
          ${(isBestseller || isAI) && !isFiller && !isAddProduct ? 'md:col-span-2' : ''}
          ${isAI ? 'ring-1 ring-cyan-500/30' : ''}
          ${isFiller ? 'opacity-90 border-dashed border-brand-accent/20' : ''}
        `}
      >
        <Link to={isFiller ? '/marketplace' : `/product/${product._id}`} className="flex flex-col flex-1">
          {/* Neon Glow Accents */}
          <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-700
            ${isAI ? 'bg-cyan-500' : isBestseller ? 'bg-amber-500' : isDiscount ? 'bg-red-500' : 'bg-brand-accent'}
          `} />

          {/* Image Hub */}
          <div className={`relative overflow-hidden ${isBestseller || isAI ? 'h-72' : 'h-52'} bg-brand-void/80`}>
            <img 
              src={product.images?.[0] || `https://source.unsplash.com/800x600/?${product.category || 'product'}`} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ease-out" 
            />
            
            {/* Top Overlays */}
            <div className="absolute top-5 left-5 flex flex-col gap-2">
              {product.badge && (
                <span className={`px-4 py-1.5 rounded-full font-display text-[11px] font-black tracking-widest uppercase border backdrop-blur-xl shadow-2xl flex items-center gap-1.5
                  ${isBestseller ? 'bg-amber-500 text-black border-amber-400/50' : 
                    isAI ? 'bg-cyan-500 text-black border-cyan-400/50' : 
                    isFast ? 'bg-brand-text text-brand-void border-white/20' :
                    isNearby ? 'bg-brand-accent text-brand-void border-white/20' :
                    'bg-white/10 text-white border-white/10'}
                `}>
                  {isAI && <Sparkles size={12} />}
                  {isFast && <Zap size={12} fill="currentColor" />}
                  {product.badge}
                </span>
              )}
              {isDiscount && (
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white px-3 py-1.5 rounded-full font-display text-[11px] font-black border border-white/20 shadow-xl">
                    {product.discount}
                  </span>
                  <span className="bg-brand-void/60 text-white/60 px-2 py-1.5 rounded-full font-mono text-[10px] backdrop-blur-md italic">
                    Limited Offer
                  </span>
                </div>
              )}
              {isFast && (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full font-mono text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                  <Clock size={12} /> {product.deliveryTime}
                </span>
              )}
            </div>

            <div className="absolute top-5 right-5 bg-brand-void/60 backdrop-blur-2xl px-3 py-1.5 rounded-2xl flex items-center gap-1.5 border border-white/10 shadow-2xl">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="font-mono text-sm text-white font-bold">{product.rating}</span>
            </div>
          </div>

          {/* Content Hub */}
          <div className={`p-8 flex-1 flex flex-col ${isBestseller || isAI ? 'md:p-10' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`font-display text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 rounded-lg
                ${isAI ? 'bg-cyan-500/10 text-cyan-400' : 'bg-brand-accent/10 text-brand-accent'}
              `}>
                {product.category}
              </span>
              <span className="font-mono text-[11px] text-brand-text/30 flex items-center gap-1 font-medium italic">
                BY {product.vendorName}
              </span>
            </div>

            <h3 className={`font-display font-extrabold leading-tight mb-3 group-hover:text-brand-accent transition-colors
              ${isBestseller || isAI ? 'text-3xl md:text-4xl tracking-tight' : 'text-xl tracking-tight'}
            `}>
              {product.name}
            </h3>

            <p className="font-mono text-xs text-brand-text/40 mb-8 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-6">
              <div className="flex flex-col gap-1">
                {product.oldPrice && !isFiller && (
                  <span className="text-xs text-brand-text/20 line-through font-mono decoration-red-500/50">₹{product.oldPrice}</span>
                )}
                <div className="flex items-baseline gap-1">
                  {!isFiller && <span className="text-brand-text/40 text-[10px] font-mono uppercase">Starting</span>}
                  <span className={`font-display font-black tracking-tight ${isBestseller || isAI ? 'text-4xl text-brand-text' : 'text-2xl text-brand-text'}`}>
                    {isFiller ? 'PROMO' : `₹${product.price}`}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="flex items-center gap-1.5 text-[11px] text-brand-accent font-mono font-bold uppercase tracking-widest bg-brand-accent/5 px-3 py-1.5 rounded-full border border-brand-accent/10">
                  <MapPin size={12} fill="currentColor" fillOpacity={isNearby ? 1 : 0.2} />
                  {product.distance}
                </span>
              </div>
            </div>
          </div>
        </Link>
          
        {/* Action Hub */}
        <div className="flex gap-3 p-8 pt-0 relative z-20">
          {isFiller ? (
            <Link 
              to="/marketplace"
              className="w-full flex items-center justify-center gap-2 bg-brand-accent/10 text-brand-accent border border-brand-accent/20 py-4 rounded-2xl font-display text-[10px] font-black tracking-[0.2em] hover:bg-brand-accent hover:text-brand-void transition-all"
            >
              <ArrowRight size={14} strokeWidth={3} /> EXPLORE REPOSITORY
            </Link>
          ) : (
            <>
              <button 
                onClick={(e) => handleAddToCart(e, product)}
                className={`flex-1 group/btn relative overflow-hidden py-4 rounded-2xl font-display text-[10px] font-black tracking-[0.2em] transition-all
                  ${addedItems[product._id] ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/30' : 
                    'bg-brand-text text-brand-void hover:translate-y-[-2px] hover:shadow-[0_15px_30px_-5px_rgba(255,255,255,0.2)] active:translate-y-[0px] shadow-2xl'}
                `}
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {addedItems[product._id] ? (
                    <><Check size={14} strokeWidth={3} /> ADDED</>
                  ) : (
                    <><ShoppingCart size={14} strokeWidth={3} /> ADD TO HUB</>
                  )}
                </div>
              </button>

              <a 
                href={`https://wa.me/${(product.vendorPhone || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I want to order ${product.name} (₹${product.price}) from VyapaarSetu.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center justify-center group/wa"
                title="Chat on WhatsApp"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.484 2.247 2.247 3.484 5.232 3.484 8.402 0 6.556-5.332 11.89-11.888 11.89-2.015 0-3.991-.511-5.741-1.478l-6.24 1.699zm6.314-2.042c1.626.963 3.223 1.444 4.743 1.444 5.922 0 10.738-4.816 10.738-10.738 0-5.922-4.816-10.738-10.738-10.738-2.859 0-5.547 1.113-7.57 3.135-2.022 2.022-3.135 4.711-3.135 7.603 0 2.036.55 4.004 1.597 5.763l-.951 3.474 3.56-1.04z" />
                </svg>
              </a>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-void text-brand-text p-6 md:p-12 pt-32 selection:bg-brand-accent selection:text-brand-void">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 relative">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-brand-accent/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-brand-text/40 font-mono text-[10px] tracking-[0.4em] uppercase mb-8 shadow-2xl backdrop-blur-xl">
              Unified Commerce Protocol <span className="text-brand-accent font-bold">v3.0</span>
            </div>
            
            <h1 className="font-display text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.8]">
              THE <span className="text-brand-accent italic font-drama font-normal">MARKET</span>
            </h1>
            
            <p className="font-mono text-xs md:text-sm text-brand-text/30 max-w-xl mx-auto leading-relaxed tracking-wider">
              Experience the next generation of localized trade. AI-ranked, real-time logistics, and verified vendor networks.
            </p>
          </div>
        </header>

        {/* Global Nav Control */}
        <div className="flex flex-col gap-10 mb-20">
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat.toLowerCase())}
                className={`px-8 py-3 rounded-full font-display text-[10px] font-black tracking-[0.2em] transition-all duration-300
                  ${activeCategory === cat.toLowerCase() ? 'bg-brand-accent text-brand-void shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] scale-110' : 'bg-brand-card/50 text-brand-text/30 border border-white/5 hover:border-white/20'}
                `}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="bg-brand-card/30 backdrop-blur-3xl p-3 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center gap-3 max-w-5xl mx-auto w-full shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]">
            <button 
              onClick={requestLocation}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.75rem] font-display text-[10px] font-black tracking-widest transition-all
                ${location ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/20 shadow-inner' : 'bg-white/5 text-brand-text/30 hover:bg-white/10 hover:text-brand-text'}
              `}
            >
              <MapPin size={16} strokeWidth={3} />
              {location ? 'NODE LOCKED' : 'SYNC COORDS'}
            </button>
            
            <div className="flex-1 flex w-full relative group">
              <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-brand-text/20 group-focus-within:text-brand-accent transition-colors duration-500" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="PROBE MARKET INVENTORY..."
                className="w-full bg-transparent border-none text-brand-text px-20 py-5 font-mono text-sm focus:outline-none placeholder:text-brand-text/10" 
              />
            </div>
            
            <button 
              onClick={handleSmartSearch} 
              className="flex items-center gap-3 bg-brand-accent text-brand-void px-10 py-5 rounded-[1.75rem] font-display font-black text-xs tracking-widest hover:brightness-110 transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] active:scale-95 group"
            >
              <TrendingUp size={18} className="group-hover:translate-y-[-2px] transition-transform" /> 
              AI RE-RANK
            </button>

            {user?.role === 'vendor' && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-3 bg-white text-brand-void px-10 py-5 rounded-[1.75rem] font-display font-black text-xs tracking-widest hover:bg-brand-accent hover:text-brand-void transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] active:scale-95 group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
                ADD PRODUCT
              </button>
            )}
          </div>
        </div>

        {/* The Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
               <div className="w-20 h-20 border-[3px] border-brand-accent/10 border-t-brand-accent rounded-full animate-spin shadow-2xl" />
               <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-accent animate-pulse" size={24} />
            </div>
            <span className="font-mono text-[10px] text-brand-text/30 tracking-[0.8em] font-black uppercase pr-[-0.8em]">Syncing Streams</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {displayItems.map(product => renderCard(product))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[4rem]">
            <div className="w-24 h-24 bg-brand-card/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
              <Search size={40} className="text-brand-text/10" />
            </div>
            <h3 className="font-display font-black text-2xl mb-3 tracking-tighter">NO SIGNALS DETECTED</h3>
            <p className="font-mono text-xs text-brand-text/20 tracking-widest uppercase">Broaden search parameters or reset spectral filters.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-brand-void/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-brand-card w-full max-w-xl rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-black">DEPLOY NEW ITEM</h2>
                <p className="font-mono text-[10px] text-brand-text/40 uppercase tracking-widest">Inventory Injection Protocol</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-8 overflow-y-auto flex-1 space-y-6 scrollbar-hide">
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-brand-accent font-black uppercase">Product Name</label>
                <input name="name" required placeholder="NEXUS PRIME DRONE..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-accent transition-colors font-mono text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-accent font-black uppercase">Category</label>
                  <select name="category" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-accent transition-colors font-mono text-sm appearance-none">
                    {CATEGORIES.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat.toLowerCase()} className="bg-brand-card">{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-accent font-black uppercase">Product Type</label>
                  <select name="type" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-accent transition-colors font-mono text-sm appearance-none">
                    <option value="standard" className="bg-brand-card">Standard</option>
                    <option value="nearby" className="bg-brand-card">Nearby</option>
                    <option value="fast_delivery" className="bg-brand-card">Fast Delivery</option>
                    <option value="discount" className="bg-brand-card">Discount</option>
                    <option value="bestseller" className="bg-brand-card">Bestseller</option>
                    <option value="ai" className="bg-brand-card">AI Recommended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-accent font-black uppercase">Price (INR)</label>
                  <input name="price" type="number" required placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-accent transition-colors font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-brand-accent font-black uppercase">Vendor Phone</label>
                  <input name="vendorPhone" required placeholder="+91..." defaultValue={user?.phone || ''} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-accent transition-colors font-mono text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] text-brand-accent font-black uppercase">Image URL (Optional)</label>
                <input name="imageUrl" placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-accent transition-colors font-mono text-sm" />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-[10px] text-brand-accent font-black uppercase">Description</label>
                <textarea name="description" rows={4} placeholder="Describe the item specs..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-accent transition-colors font-mono text-sm resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full group/submit relative bg-brand-accent text-brand-void py-5 rounded-2xl font-display font-black text-xs tracking-widest hover:brightness-110 transition-all shadow-[0_15px_30px_-5px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={18} /> PROCESSING...</>
                  ) : (
                    <><Plus size={18} strokeWidth={3} /> INITIALIZE DEPLOYMENT</>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[20000] flex items-center gap-3 px-8 py-4 rounded-2xl border backdrop-blur-xl animate-in slide-in-from-bottom-8 duration-500 shadow-2xl
          ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-brand-accent/10 border-brand-accent/20 text-brand-accent'}
        `}>
          {toast.type === 'error' ? <X size={18} /> : <Check size={18} />}
          <span className="font-mono text-xs font-bold tracking-wider">{toast.message.toUpperCase()}</span>
        </div>
      )}

      <style jsx>{`
        .featured-card-gradient::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(16,185,129,0.05) 0%, transparent 100%);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default Marketplace;
