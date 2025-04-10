import { Outlet } from "react-router";
import Navbar from "./components/navbar";


export function DefaultLayout() {
  return (
    <>
      <Navbar/>
      <Outlet/>
    </>
  );
}
