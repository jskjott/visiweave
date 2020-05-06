<template>
	<div id="header">
		<input v-model="selectTransforms[selectionString]" v-on:input="updateFormula" id="commandLine" placeholder="fx" 
name="" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

const vue = Vue.extend({
	name: 'CommandLine',
	props: ['selectTransforms', 'selection'],
	data() {
		return {}
	},
	methods: {
		updateFormula: function(){
			console.log('change', this.selectTransforms[this.selectionString])

			const selectTransforms = this.selectTransforms

			this.$emit('transformUpdate', {
				selectTransforms
			})
		}
	},
	computed: {
		selectionString: function(){
			if (this.selection) {
				const start = this.selection[0].id
				const end = this.selection[1].id

				return `${start}:${end}`
			}
		}
	}
	watch: { 
		selection: function(){
			if (!this.selectTransforms[this.selectionString]) {
				this.selectTransforms[this.selectionString] = `(each(select "${this.selectionString}") (lambda (a) ()))`
			}
		},
	}
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
