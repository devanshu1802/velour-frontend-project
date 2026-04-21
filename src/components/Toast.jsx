import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toastMessage } = useCart();

  return (
    <div className="toast-container">
      <div className={`toast ${toastMessage ? 'visible' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
};

export default Toast;
