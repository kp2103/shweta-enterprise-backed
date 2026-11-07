import { DB } from '../../config/dbConnect.js';
import { retailTable } from '../../db/schemas/retail.schema.js';

type DefaultRetail = 'id' | 'isActive' | 'createdAt' | 'updatedAt';
type Retailer = Omit<typeof retailTable.$inferInsert, DefaultRetail>;

export async function createRetailer(retailer: Retailer) {
  const reatilerObj = (
    await DB.getInstance().insert(retailTable).values(retailer).returning({
      shopName: retailTable.shopName,
      gstNo: retailTable.gstNo,
      phone: retailTable.phone,
      shopPhotoUrl: retailTable.shopPhotoUrl,
      address: retailTable.address,
      postalCode: retailTable.postalCode,
      area: retailTable.area,
      city: retailTable.city,
      latitude: retailTable.latitude,
      longitude: retailTable.longitude,
    })
  )[0];

  if (!reatilerObj) return null;

  return reatilerObj;
}
