import { vendorsAPI } from "../../../lib/api/vendors";
import {  cookies } from "next/headers";

type Props = {
  params: { businessName: string };
};

export default async function VendorDetailPage({ params }: Props) {
  try {
    const cookieStore = cookies();
    const cookieBusinessName = cookieStore.get("selectedBusinessName")?.value;

    const businessNameToUse = cookieBusinessName || params.businessName;

    console.log("Using business name:", businessNameToUse);

    const res = await vendorsAPI.getByBusinessName(businessNameToUse);
    const data = res.data?.data;

    // if (!data) return notFound();

    const { vendor, products } = data;
    const fullName = `${vendor.user.firstName} ${vendor.user.lastName}`;

    return (
      <div className="max-w-5xl mx-auto px-6 py-12 bg-white shadow rounded-md">
        <h1 className="text-4xl font-extrabold mb-3 text-indigo-600">
          {vendor.businessName}
        </h1>

        {vendor.businessDescription && (
          <p className="text-lg text-gray-600 mb-6">{vendor.businessDescription}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Vendor Info</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Name:</strong> {fullName}
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${vendor.user.email}`} className="text-indigo-500 hover:underline">
                  {vendor.user.email}
                </a>
              </li>
              <li>
                <strong>Verification Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    vendor.verificationStatus === "APPROVED"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {vendor.verificationStatus}
                </span>
              </li>
              <li>
                <strong>Rating:</strong> {vendor.rating ?? "N/A"}
              </li>
              <li>
                <strong>Total Products:</strong> {vendor.totalProducts ?? 0}
              </li>
              <li>
                <strong>Total Sales:</strong> {vendor.totalSales ?? 0}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Products</h2>
            {products.length === 0 ? (
              <p className="text-gray-500 italic">No products available.</p>
            ) : (
              <ul className="space-y-3">
                {products.map((product: any) => (
                  <li
                    key={product._id}
                    className="border p-4 rounded hover:shadow-md transition"
                  >
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <p className="mt-2 font-semibold">Price: ${product.price}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // return notFound();
  }
}
