import { useState, useEffect } from "react";

//cập nhật cập nhật giá trị trả về sau 1 khoảng thời gian kể từ lần cuối mà giá trị value thay đổi
//delay: ms
export const useDebounce = (value, delay) => {
  //lưu giá trị đã được debounce,
  //sử dụng state vì khi sử dụng hook useDebounce thì component sẽ re-render
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    /*khi giá trị của value thay đổi, 1 setTimeout được đặt để cập nhật giá trị sau 1
    khoảng thời gian delay, nếu chưa hết khoảng thời gian delay mà value đã thay đổi 
    thì useEffect sẽ chạy lại và lại đặt lại thời gian delay mới */
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    //nếu thời gian delay chưa hoàn thành thì clearTimeout sẽ xóa timeout hiện tại, tránh setDebouncedValue cập nhật giá trị cũ
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
