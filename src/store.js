import { all } from "axios";
import { reactive } from "vue";

export const store = reactive({
  buildings: [],
  services: [],
  servicesIds: [],
  currentPage: 1,
  lastPage: 0,
  page: 0,
  address: "",
  lat: "",
  lon: "",
  radius: 50000,
  rooms: null,
  beds: null,
  bedsFilter: all,
  roomsFilter: all,
  bathsFilter: all,
  servicesFilter: all,
  bathrooms: null,
  BASE_URL: "http://127.0.0.1:8000/api",
});
