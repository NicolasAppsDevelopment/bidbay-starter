<script setup lang="ts">
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { API_URL } from "../config/config";

const { isAuthenticated, token } = useAuthStore();
const router = useRouter();

if (!isAuthenticated.value) {
  router.push({ name: "Login" });
}

const loading = ref(false);
const error = ref(false);
const errorStr = ref("")

const productNameInput = ref("");
const productDescInput = ref("");
const productCategInput = ref("");
const productPriceInput = ref("");
const productImageInput = ref("");
const productSellingEndInput = ref("");

const addProduct = async () => {
  try {
    const res = await fetch(API_URL + 'api/products', { 
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
        "Authorization": "Barear " + token
      },
      body: JSON.stringify({
        "name": productNameInput.value,
        "description": productDescInput.value,
        "pictureUrl": productImageInput.value,
        "category": productCategInput.value,
        "originalPrice": productPriceInput.value,
        "endDate": productSellingEndInput.value
	    })
    });
    const result = await res.json();
    router.push({ name: "Product", params: { productId: result.id } });
  } catch (e) {
    errorStr.value = "Une erreur s'est produite lors de l'ajout du produit."
    if (e instanceof Error){
      errorStr.value += " " + e.message;
    } 
    error.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <h1 class="text-center">Ajouter un produit</h1>

  <div class="row justify-content-center">
    <div class="col-md-6">
      <form>
        <div v-if="error === true" class="alert alert-danger mt-4" role="alert" data-test-error>
          {{ errorStr }} 
        </div>

        <div class="mb-3">
          <label for="product-name" class="form-label"> Nom du produit </label>
          <input
            v-model="productNameInput"
            type="text"
            class="form-control"
            id="product-name"
            required
            data-test-product-name
          />
        </div>

        <div class="mb-3">
          <label for="product-description" class="form-label">
            Description
          </label>
          <textarea
            v-model="productDescInput"
            class="form-control"
            id="product-description"
            name="description"
            rows="3"
            required
            data-test-product-description
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="product-category" class="form-label"> Catégorie </label>
          <input
            v-model="productCategInput"
            type="text"
            class="form-control"
            id="product-category"
            required
            data-test-product-category
          />
        </div>

        <div class="mb-3">
          <label for="product-original-price" class="form-label">
            Prix de départ
          </label>
          <div class="input-group">
            <input
              v-model="productPriceInput"
              type="number"
              class="form-control"
              id="product-original-price"
              name="originalPrice"
              step="1"
              min="0"
              required
              data-test-product-price
            />
            <span class="input-group-text">€</span>
          </div>
        </div>

        <div class="mb-3">
          <label for="product-picture-url" class="form-label">
            URL de l'image
          </label>
          <input
            v-model="productImageInput"
            type="url"
            class="form-control"
            id="product-picture-url"
            name="pictureUrl"
            required
            data-test-product-picture
          />
        </div>

        <div class="mb-3">
          <label for="product-end-date" class="form-label">
            Date de fin de l'enchère
          </label>
          <input
            v-model="productSellingEndInput"
            type="date"
            class="form-control"
            id="product-end-date"
            name="endDate"
            required
            data-test-product-end-date
          />
        </div>

        <div class="d-grid gap-2">
          <button
            type="submit"
            class="btn btn-primary"
            data-test-submit
            @click="addProduct"
          >
            Ajouter le produit
            <span v-if="loading === true"
              data-test-spinner
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
