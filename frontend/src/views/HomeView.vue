<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { API_URL } from "../config/config";

const loading = ref(false);
const error = ref(false);
const errorStr = ref("");
type Products ={
  id: string;
  name: string;
  description: string;
  category: string;
  originalPrice: number;
  lastPrice: number;
  pictureUrl: string;
  endDate: string;
  seller: {
    id: string;
    username: string;
  };
  bids: {
    id: string;
    price: number;
    date: string;
  }[];
}[];
const products: Ref<Products> = ref([]);
const filterInput = ref("");
const sortInput = ref("name");
const sortStr = ref("Trier par nom");

const productsToDisplay = computed(() => {
  let filteredArray = products.value.filter(
    n => n.name.toLocaleLowerCase().includes(filterInput.value.toLocaleLowerCase())
  );
  switch (sortInput.value) {
    case "name":
    return filteredArray.sort((a, b) => a.name.localeCompare(b.name));
    
    case "price":
      return filteredArray.sort((a, b) => a.lastPrice - b.lastPrice);

    default:
      break;
  }
});

const setNameFilter = () => {
  sortInput.value = "name";
  sortStr.value = "Trier par nom";
};
const setPriceFilter = () => {
  sortInput.value = "price";
  sortStr.value = "Trier par prix";
};

async function fetchProducts() {
  loading.value = true;
  error.value = false;

  try {
    const res = await fetch(API_URL + 'api/products');
    products.value = await res.json();
  } catch (e) {
    errorStr.value = "Une erreur est survenue lors du chargement des produits."
    if (e instanceof Error){
      errorStr.value += " " + e.message;
    } 
    error.value = true;
  } finally {
    loading.value = false;
  }
}

fetchProducts();
</script>

<template>
  <div>
    <h1 class="text-center mb-4">Liste des produits</h1>

    <div class="row mb-3">
      <div class="col-md-6">
        <form>
          <div class="input-group">
            <span class="input-group-text">Filtrage</span>
            <input
              v-model="filterInput"
              type="text"
              class="form-control"
              placeholder="Filtrer par nom"
              data-test-filter
            />
          </div>
        </form>
      </div>
      <div class="col-md-6 text-end">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-primary dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-test-sorter
          >
           {{ sortStr }} 
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#" @click="setNameFilter"> Nom </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click="setPriceFilter" data-test-sorter-price>
                Prix
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="loading === true" class="text-center mt-4" data-test-loading>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-if="error === true" class="alert alert-danger mt-4" role="alert" data-test-error>
      {{ errorStr }} 
    </div>
    <div class="row">
      <div class="col-md-4 mb-4" v-for="product in productsToDisplay" data-test-product :key="product.id">
        <div class="card">
          <RouterLink :to="{ name: 'Product', params: { productId: product.id } }">
            <img
              :src="product.pictureUrl"
              data-test-product-picture
              class="card-img-top"
            />
          </RouterLink>
          <div class="card-body">
            <h5 class="card-title">
              <RouterLink
                data-test-product-name
                :to="{ name: 'Product', params: { productId: product.id } }"
              >
               {{ product.name }} 
              </RouterLink>
            </h5>
            <p class="card-text" data-test-product-description>
             {{ product.description }} 
            </p>
            <p class="card-text">
              Vendeur :
              <RouterLink
                data-test-product-seller
                :to="{ name: 'User', params: { userId: product.seller.id } }"
              >
               {{ product.seller.username }} 
              </RouterLink>
            </p>
            <p class="card-text" data-test-product-date>
              {{ new Date(product.endDate) < new Date() ? "Terminé" : "En cours jusqu'au " + new Date(product.endDate).toLocaleDateString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit'}) }}
            </p>
            <p class="card-text" data-test-product-price>{{ product.bids.length > 0 ? "Prix actuel : " + product.lastPrice : "Prix de départ : " + product.lastPrice }}  €</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
