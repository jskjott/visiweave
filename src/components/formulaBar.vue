<template>
	<div id="header">
		<input id="commandLine" type=""
name="" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

const vue = Vue.extend({
	name: 'CommandLine',
	props: [],
	data() {
		return {}
	},
	methods: {},
})

export default vue
</script>

<style scoped="">
#header {
	height: 50px;
	background: silver;
}

#commandLine {
	font-size: 1.5em;
	width: 100%;
	height: 100%;
	padding: 0.4rem;
}

#commandLine:focus {
	outline: none;
}
</style>
