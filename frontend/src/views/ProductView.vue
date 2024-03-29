<script setup lang="ts">
import { ref, computed, Ref } from "vue";
import { useRoute, useRouter, RouterLink, stringifyQuery } from "vue-router";
import { useAuthStore } from "../store/auth";
import { API_URL } from "@/config/config";

const { isAuthenticated, isAdmin, userData, token } = useAuthStore();


const route = useRoute();
const router = useRouter();

const productId = ref(route.params.productId);

/**
 * @param {number|string|Date} date
 */
function formatDate(date: number|string|Date) {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
}

const loading = ref(false);
const error = ref(false);
const errorStr = ref("");
const countdown = ref("...");
type Product = {
  id: string,
  name: string,
  description: string,
  category: string,
  originalPrice: number,
  pictureUrl: string,
  endDate: string,
  seller: {
    id: string,
    username: string
  },
  bids:
  {
    id: string,
    price: number,
    date: string,
    bidder: {
      id: string,
      username: string
    }
  }[]
};
const product: Ref<Product> = ref({
  "id": "",
  "name": "",
  "description": "",
  "category": "",
  "originalPrice": 0,
  "pictureUrl": "",
  "endDate": "2023-03-23T17:29:12.261Z",
  "seller": {
      "id": "",
      "username": ""
  },
  "bids": []
});

function startTimer() {
  let end = new Date(product.value.endDate);
  let timerInterval = setInterval(() => { 
    let now = new Date();
    
    let sec = Math.round((end.getTime() - now.getTime()) / 1000);
    if (sec <= 0) {
      countdown.value = "Vente terminée";
      clearInterval(timerInterval);
    } else {
      let str_s = sec % 60;
      let str_m = Math.floor(sec / 60) % 60;
      let str_h = Math.floor(sec / (60 * 60));

      countdown.value = (str_h < 10 ? "0" + str_h : str_h)  + ":" + (str_m < 10 ? "0" + str_m : str_m) + ":" + (str_s < 10 ? "0" + str_s : str_s)
    }
  }, 1000);
}

async function fetchProduct(id: string | string[]) {
  loading.value = true;
  error.value = false;

  try {
    const res = await fetch(API_URL + 'api/product/' + id);
    product.value = await res.json();
    startTimer();
  } catch (e) {
    errorStr.value = "Une erreur est survenue lors du chargement du produit."
    if (e instanceof Error){
      errorStr.value += " " + e.message;
    } 
    error.value = true;
  } finally {
    loading.value = false;
  }
}

async function removeProduct() {
  loading.value = true;
  error.value = false;

  try {
    const res = await fetch(API_URL + 'api/product/' + productId, {
      method: 'DELETE',
      headers: {
        "Authorization": "Barear " + token
      }
    });
  } catch (e) {
    errorStr.value = "Une erreur est survenue lors de la suppression du produit."
    if (e instanceof Error){
      errorStr.value += " " + e.message;
    } 
    error.value = true;
  } finally {
    loading.value = false;
  }
}

fetchProduct(productId.value);

</script>

<template>
  <div class="row">
    <div v-if="loading === true" class="text-center mt-4" data-test-loading>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-if="error === true" class="alert alert-danger mt-4" role="alert" data-test-error>
      {{ errorStr }} 
    </div>
    <div class="row" data-test-product>
      <!-- Colonne de gauche : image et compte à rebours -->
      <div class="col-lg-4">
        <img
          src="https://picsum.photos/id/250/512/512"
          alt=""
          class="img-fluid rounded mb-3"
          data-test-product-picture
        />
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Compte à rebours</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted" data-test-countdown>
              Temps restant : {{ countdown }}
            </h6>
          </div>
        </div>
      </div>

      <!-- Colonne de droite : informations du produit et formulaire d'enchère -->
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="mb-3" data-test-product-name>
              {{ product.name }}
            </h1>
          </div>
          <div class="col-lg-6 text-end">
            <RouterLink
              :to="{ name: 'ProductEdition', params: { productId: product.id } }"
              class="btn btn-primary"
              data-test-edit-product
              v-if="(isAuthenticated && userData?.id == product.seller.id) || isAdmin"
            >
              Editer
            </RouterLink>
            &nbsp;
            <button 
              class="btn btn-danger"
              data-test-delete-product
              v-if="(isAuthenticated && userData?.id == product.seller.id) || isAdmin"
              @click="removeProduct">
                Supprimer
            </button>
          </div>
        </div>

        <h2 class="mb-3">Description</h2>
        <p data-test-product-description>
          {{ product.description }}
        </p>

        <h2 class="mb-3">Informations sur l'enchère</h2>
        <ul>
          <li data-test-product-price>Prix de départ : {{ product.originalPrice }} €</li>
          <li data-test-product-end-date>Date de fin : {{ formatDate(product.endDate) }}</li>
          <li>
            Vendeur :
            <router-link
              :to="{ name: 'User', params: { userId: product?.seller.id } }"
              data-test-product-seller
            >
            {{ product.seller.username }}
            </router-link>
          </li>
        </ul>

        <h2 class="mb-3">Offres sur le produit</h2>
        <table class="table table-striped" data-test-bids>
          <thead>
            <tr>
              <th scope="col">Enchérisseur</th>
              <th scope="col">Offre</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bid in product.bids" :key="bid.id" data-test-bid>
              <td>
                <router-link
                  :to="{ name: 'User', params: { userId: bid.bidder.id } }"
                  data-test-bid-bidder
                >
                  {{ bid.bidder.username }} 
                </router-link>
              </td>
              <td data-test-bid-price>{{ bid.price }} €</td>
              <td data-test-bid-date>{{ formatDate(bid.date) }}</td>
              <td>
                <button class="btn btn-danger btn-sm" data-test-delete-bid>
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p data-test-no-bids>Aucune offre pour le moment</p>

        <form data-test-bid-form>
          <div class="form-group">
            <label for="bidAmount">Votre offre :</label>
            <input
              type="number"
              class="form-control"
              id="bidAmount"
              data-test-bid-form-price
            />
            <small class="form-text text-muted">
              Le montant doit être supérieur à 10 €.
            </small>
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            disabled
            data-test-submit-bid
          >
            Enchérir
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
