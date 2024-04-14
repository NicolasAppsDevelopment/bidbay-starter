<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuthStore } from "../store/auth";

const { isAuthenticated, userData } = useAuthStore();

const router = useRouter();
const route = useRoute();

const user = ref(null);
const loading = ref(false);
const error = ref(null);
const errorStr = ref("");

let userId = computed(() => route.params.userId);

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

type Products ={
  id: string;
  name: string;
  description: string;
  category: string;
  originalPrice: number;
  lastPrice: number;
  pictureUrl: string;
  endDate: string;
  bids: {
    id: string;
  }[];
}[];
const products: Ref<Products> = ref([]);

type Bid ={
  id: string;
  price: number;
  date: Date;
  product: {
    id: string;
    name: string;
  }[];
}[];
const bids: Ref<Bid> = ref([]);

async function fetchProductsBids() {
  loading.value = true;
  error.value = false;

  try {
    const res = await fetch(API_URL + '/api/users/'+userId);
    const jsonRes = await res.json();
    if (res.status != 200 || (jsonRes['status'] != undefined && jsonRes['status'] != 200)) {
      throw new Error("Le serveur à retourner une erreur.");
    }
    console.log(jsonRes);
    products.value = jsonRes.map(item => item.products);
    bids.value = jsonRes.map(item => item.bids);
    console.log("PRODUCTS OF USER");
    console.log(products.value);
    console.log(bids.value);
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

fetchProductsBids();
</script>

<template>
  <div>
    <h1 class="text-center" data-test-username>
      Utilisateur charly
      <span class="badge rounded-pill bg-primary" data-test-admin>Admin</span>
    </h1>
    <div class="text-center" data-test-loading>
      <span class="spinner-border"></span>
      <span>Chargement en cours...</span>
    </div>
    <div class="alert alert-danger mt-3" data-test-error>
      Une erreur est survenue
    </div>
    <div data-test-view>
      <div class="row">
        <div class="col-lg-6">
          <h2>Produits</h2>
          <div class="row">
            <div
              class="col-md-6 mb-6 py-2"
              v-for="i in 10"
              :key="i"
              data-test-product
            >
              <div class="card">
                <RouterLink
                  :to="{ name: 'Product', params: { productId: products.id } }"
                >
                  <img
                    :src="products.pictureUrl"
                    class="card-img-top"
                    data-test-product-picture
                  />
                </RouterLink>
                <div class="card-body">
                  <h5 class="card-title">
                    <RouterLink
                      :to="{
                        name: 'Product',
                        params: { productId: products.id },
                      }"
                      data-test-product-name
                    >
                    {{ productS.name }} 
                    </RouterLink>
                  </h5>
                  <p class="card-text" data-test-product-description>
                    {{ product.description }} 
                  </p>
                  <p class="card-text" data-test-product-price>
                    {{ product.originalPrice }} 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <h2>Offres</h2>
          <h3>Nombre d'offres : {{ productS.bids.length }} </h3>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Offre</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 10" :key="i" data-test-bid>
                <td>
                  <RouterLink
                    :to="{
                      name: 'Bid',
                      params: { bidId: bids.id },
                    }"
                    data-test-bid-product
                  >
                    {{ bids.product.name }} 
                  </RouterLink>
                </td>
                <td data-test-bid-price>{{ bids.price }} </td>
                <td data-test-bid-date>{{ bids.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
