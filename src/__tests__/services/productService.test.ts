import { ProductService } from "../../services/productService";
import type { ProductDTO } from "../../types";

jest.useFakeTimers();
beforeEach(() => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({
      data: [{ id: "1", name: "Test Product", unitPrice: 100, isActive: true }],
    }),
  } as any);
});

afterEach(() => {
  jest.restoreAllMocks();
});
describe("ProductService", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  test("getAllProducts returns array of products", async () => {
    const promise = ProductService.getAllProducts();
    jest.advanceTimersByTime(500);

    const products = await promise;

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("id");
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("unitPrice");
  });

  test("getProductById returns specific product", async () => {
    const promise = ProductService.getProductById("1");

    jest.advanceTimersByTime(300);

    const product = await promise;

    expect(product).toBeTruthy();
    expect(product?.id).toBe("1");
  });

  test("getProductById returns undef for non-existent product", async () => {
    const promise = ProductService.getProductById("999");

    jest.advanceTimersByTime(300);

    const product = await promise;

    expect(product).toBeUndefined();
  });

  test("createProduct adds new product", async () => {
    const newProductData: Omit<ProductDTO, "id"> = {
      name: "New Test Product",
      unitPrice: 99.99,
      isActive: true,
      unitsInStock: 15,
    };

    const createPromise = ProductService.createProduct(newProductData);

    jest.advanceTimersByTime(500);

    const createdProduct = await createPromise;

    expect(createdProduct).toMatchObject(newProductData);
    expect(createdProduct.id).toBeTruthy();

    const getAllPromise = ProductService.getAllProducts();
    jest.advanceTimersByTime(500);

    const allProducts = await getAllPromise;
    const foundProduct = allProducts.find((p) => p.id === createdProduct.id);

    expect(foundProduct).toMatchObject(newProductData);
  });

  test("updateProduct modifies existing product", async () => {
    const updateData: Omit<ProductDTO, "id"> = {
      name: "Updated Product Name",
      unitPrice: 149.99,
      isActive: false,
      unitsInStock: 5,
    };

    const promise = ProductService.updateProduct("1", updateData);

    jest.advanceTimersByTime(500);

    const updatedProduct = await promise;

    expect(updatedProduct).toMatchObject(updateData);
    expect(updatedProduct.id).toBe("1");
  });

  test("updateProduct throws error for non-existent product", async () => {
    const updateData: Omit<ProductDTO, "id"> = {
      name: "Updated Product Name",
      unitPrice: 149.99,
      isActive: false,
      unitsInStock: 5,
    };

    const promise = ProductService.updateProduct("999", updateData);

    jest.advanceTimersByTime(500);

    await expect(promise).rejects.toThrow("Product not found");
  });

  test("deleteProduct removes product", async () => {
    const initialProductsPromise = ProductService.getAllProducts();
    jest.advanceTimersByTime(500);
    const initialProducts = await initialProductsPromise;
    const initialCount = initialProducts.length;

    const deletePromise = ProductService.deleteProduct("1");
    jest.advanceTimersByTime(300);

    await deletePromise;

    const updatedProductsPromise = ProductService.getAllProducts();
    jest.advanceTimersByTime(500);
    const updatedProducts = await updatedProductsPromise;

    expect(updatedProducts.length).toBe(initialCount - 1);
    expect(updatedProducts.find((p) => p.id === "1")).toBeUndefined();
  });
});
