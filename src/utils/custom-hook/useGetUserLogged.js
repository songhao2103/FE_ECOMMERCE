import { useEffect, useState } from "react";
import { getLocalstorageData } from "../localstorage/localstorageActions";
import { LOCALSTORAGE_KEY } from "../localstorage/localstorageKeys";

export const useGetUserLogged = (dependencies = null) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getLocalstorageData(LOCALSTORAGE_KEY.USER);
    setUser(u);
  }, [dependencies]);

  return user || null;
};
