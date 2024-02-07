import {createRouter, createWebHistory} from 'vue-router';
import BuildingsIndex from  './views/buildings/index.vue';
import Homepage from './views/Homepage.vue';
import Contacts from './views/Contacts.vue';
import BuildingsShow from './views/buildings/show.vue';

const router = createRouter({
    history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Homepage,
		},
        {
			path: '/portfolio',
			name: 'buildings.index',
			component: BuildingsIndex,
		},
        {
			path: '/contatti',
			name: 'contacts',
			component: Contacts,
		},
        {
			path: '/portfolio/:slug',
			name: 'buildings.show',
			component: BuildingsShow,
		},
    ]
})

export{ router }