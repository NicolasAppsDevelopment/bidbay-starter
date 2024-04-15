<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UserProducts } from "../model/model";
import { API_URL } from "@/config/config";
import { useAuthStore } from "../store/auth";

const { isAuthenticated, userData, isAdmin } = useAuthStore();

const router = useRouter();
const route = useRoute();


const loading = ref(false);
const error = ref(null);
const errorStr = ref("");

let userId = ref(route.params.userId);


const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString();
};

const user: Ref<UserProducts | null> = ref();

async function fetchUser(id: string | string[]) {
  loading.value = true;
  error.value = false;

  try {
    if (id == "me") {
      
    }

    const res = await fetch(API_URL + 'api/users/' + id);
    const jsonRes = await res.json();
    if (res.status != 200 || (jsonRes['status'] != undefined && jsonRes['status'] != 200)) {
      throw new Error("Le serveur à retourner une erreur.");
    }

    user.value = jsonRes;
  } catch (e) {
    errorStr.value = "Une erreur est survenue lors du chargement de l'utilisateur."
    if (e instanceof Error){
      errorStr.value += " " + e.message;
    } 
    error.value = true;
  } finally {
    loading.value = false;
  }
}

fetchUser(userId.value);
</script>

<template>
  <div>
    <h1 class="text-center" data-test-username>
      Utilisateur charly
      <span v-if="isAdmin" class="badge rounded-pill bg-primary" data-test-admin>Admin</span>
    </h1>
    <div v-if="loading === true" class="text-center" data-test-loading>
      <span class="spinner-border"></span>
      <span>Chargement en cours...</span>
    </div>
    <div v-if="error === true" class="alert alert-danger mt-3" data-test-error>
      {{ errorStr }}
    </div>
    
    <div v-if="user != null" data-test-view>
      <div class="row">
        <div class="col-lg-6">
          <h2>Produits</h2>
          <div class="row">
            <div
              class="col-md-6 mb-6 py-2"
              v-for="product in user.products"
              :key="product.id"
              data-test-product
            >
              <div class="card">
                <RouterLink
                  :to="{ name: 'Product', params: { productId: product.id } }"
                >
                  <img
                    :src="product.pictureUrl"
                    class="card-img-top"
                    data-test-product-picture
                  />
                </RouterLink>
                <div class="card-body">
                  <h5 class="card-title">
                    <RouterLink
                      :to="{
                        name: 'Product',
                        params: { productId: product.id },
                      }"
                      data-test-product-name
                    >
                    {{ product.name }} 
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
          <h3>Nombre d'offres : {{ user.products.length }} </h3>
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">Produit</th>
                <th scope="col">Offre</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bid in user.bids" :key="bid.id" data-test-bid>
                <td>
                  <RouterLink
                    :to="{
                      name: 'Product',
                      params: { productId: bid.product.id },
                    }"
                    data-test-bid-product
                  >
                    {{ bid.product.name }} 
                  </RouterLink>
                </td>
                <td data-test-bid-price>{{ bid.price }} </td>
                <td data-test-bid-date>{{ bid.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
