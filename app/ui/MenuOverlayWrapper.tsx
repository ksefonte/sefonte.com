import { getMenuItems } from '@/app/lib/strapi';
import MenuOverlay from './menuOverlay';

export default async function MenuOverlayWrapper() {
  const menuItems = await getMenuItems();
  return <MenuOverlay menuItems={menuItems} />;
}
