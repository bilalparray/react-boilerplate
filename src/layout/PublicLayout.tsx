import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { WhatsAppButton } from "../components/WhatsAppButton/WhatsAppButton";
import { ScrollToTopButton } from "../components/ScrollToTopButton/ScrollToTopButton";
import { environment } from "../environment";

export default function PublicLayout() {
  // WhatsApp business number - update this with your actual WhatsApp business number
  const whatsappNumber = environment.whatsappNumber; // Format: +[country code][number without spaces]

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTopButton />
      <WhatsAppButton phoneNumber={whatsappNumber} />
    </>
  );
}
