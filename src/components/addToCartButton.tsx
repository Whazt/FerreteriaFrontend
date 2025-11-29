import { ICartIcon } from "./icons";

interface AddToCartButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export function AddToCartButton({ disabled, onClick }: AddToCartButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-4 w-full flex items-center justify-center gap-2 rounded bg-orange-400 px-4 py-2 text-white hover:bg-orange-500 disabled:opacity-50"
    >
      <ICartIcon />
      Agregar al carrito
    </button>
  );
}
