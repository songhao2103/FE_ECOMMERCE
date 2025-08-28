export const DEVICE_TYPES = [
  {
    value: 1,
    label: "Smartphone",
  },
  {
    value: 2,
    label: "Audio",
  },
  {
    value: 3,
    label: "Laptop",
  },
  {
    value: 4,
    label: "Accessories",
  },
  {
    value: 5,
    label: "Camera",
  },
  {
    value: 0,
    label: "Other",
  },
];

export const PRODUCTS_SORT_FIELD = [
  {
    value: 1,
    label: "Tên sản phẩm",
  },
  {
    value: 2,
    label: "Giá sản phẩm",
  },
  {
    value: 3,
    label: "Discount",
  },
  {
    value: 4,
    label: "Bán chạy",
  },
  {
    value: 5,
    label: "Mới nhất",
  },
];

export const getDeviceLabel = (value) => {
  return (
    DEVICE_TYPES.find((item) => item.value === value)?.label || "Chưa xác định"
  );
};

export const getProductsSortFieldLabel = (value) => {
  return (
    PRODUCTS_SORT_FIELD.find((item) => item.value == value)?.label ||
    "Chưa xác định"
  );
};
