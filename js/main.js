// =============================================================
//  Vue 3 template (Options API) - eksempler på alt det basale
// =============================================================

const app = Vue.createApp({
    // ---------------------------------------------------------
    //  DATA - appens tilstand. Alt her er reaktivt.
    // ---------------------------------------------------------
    data() {
        return {
            intro: 'Welcome to my Vue template',

            // Tekst / HTML
            message: 'Hej verden',
            rawHtml: '<strong style="color: crimson">Jeg er rå HTML via v-html</strong>',

            // v-bind
            imageUrl: 'https://vuejs.org/images/logo.png',
            linkUrl: 'https://vuejs.org',
            isDisabled: false,

            // v-on
            counter: 0,

            // v-model
            name: '',
            agree: false,
            color: 'blue',
            fruit: '',
            hobbies: [],
            age: 18,

            // v-if / v-show
            score: 75,
            showBox: true,

            // v-for
            todos: [
                { id: 1, text: 'Lær v-for', done: true },
                { id: 2, text: 'Lær v-model', done: false },
                { id: 3, text: 'Byg en app', done: false },
            ],
            newTodo: '',
            person: { navn: 'Simon', by: 'København', sprog: 'Dansk' },

            // Class / style binding
            isActive: true,
            hasError: false,
            fontSize: 18,

            // Try / catch + fetch
            users: [],
            loading: false,
            error: null,

            // Try / catch med JSON
            jsonInput: '{"navn": "Simon", "alder": 25}',
            jsonResult: null,
            jsonError: null,

            // Watch
            searchText: '',
            searchLog: [],
        }
    },

    // ---------------------------------------------------------
    //  COMPUTED - afledte værdier. Caches og genberegnes kun
    //  når de data, de afhænger af, ændrer sig.
    // ---------------------------------------------------------
    computed: {
        reversedMessage() {
            return this.message.split('').reverse().join('')
        },
        remainingTodos() {
            return this.todos.filter(todo => !todo.done).length
        },
        grade() {
            if (this.score >= 90) return 'A'
            if (this.score >= 70) return 'B'
            if (this.score >= 50) return 'C'
            return 'F'
        },
        boxClasses() {
            return { active: this.isActive, 'text-danger': this.hasError }
        },
    },

    // ---------------------------------------------------------
    //  WATCH - kør kode når en værdi ændrer sig (side effects).
    // ---------------------------------------------------------
    watch: {
        searchText(newValue, oldValue) {
            this.searchLog.unshift(`"${oldValue}" → "${newValue}"`)
            this.searchLog = this.searchLog.slice(0, 5)
        },
    },

    // ---------------------------------------------------------
    //  METHODS - funktioner du kalder fra template eller kode.
    // ---------------------------------------------------------
    methods: {
        // Globale funktioner som alert() kan ikke kaldes direkte i
        // templaten, så vi pakker dem ind i en metode.
        show(text) {
            alert(text)
        },
        increment() {
            this.counter++
        },
        greet(event) {
            // event er det native DOM-event
            this.show(`Hej ${this.name || 'ukendt'}! (klik på <${event.target.tagName.toLowerCase()}>)`)
        },
        addTodo() {
            const text = this.newTodo.trim()
            if (!text) return
            this.todos.push({ id: Date.now(), text, done: false })
            this.newTodo = ''
        },
        removeTodo(id) {
            this.todos = this.todos.filter(todo => todo.id !== id)
        },

        // try / catch / finally med async/await
        async fetchUsers(url = 'https://jsonplaceholder.typicode.com/users') {
            this.loading = true
            this.error = null
            this.users = []
            try {
                const response = await fetch(url)
                // fetch kaster IKKE ved 404/500 - det skal vi selv tjekke
                if (!response.ok) {
                    throw new Error(`HTTP-fejl: ${response.status}`)
                }
                this.users = await response.json()
            } catch (err) {
                this.error = err.message
                console.error('Kunne ikke hente brugere:', err)
            } finally {
                // finally kører altid - uanset succes eller fejl
                this.loading = false
            }
        },
        fetchWithError() {
            this.fetchUsers('https://jsonplaceholder.typicode.com/findes-ikke')
        },

        // try / catch uden async
        parseJson() {
            this.jsonResult = null
            this.jsonError = null
            try {
                this.jsonResult = JSON.parse(this.jsonInput)
            } catch (err) {
                this.jsonError = err.message
            }
        },

        // Egen fejl med throw
        divide(a, b) {
            try {
                if (b === 0) throw new Error('Du kan ikke dividere med 0')
                this.show(`${a} / ${b} = ${a / b}`)
            } catch (err) {
                this.show(`Fejl: ${err.message}`)
            }
        },

        onChildClicked(payload) {
            this.show(`Barn-komponenten sendte: ${payload}`)
        },
    },

    // ---------------------------------------------------------
    //  LIFECYCLE HOOKS
    // ---------------------------------------------------------
    created() {
        // Data er klar, men DOM'en er ikke tegnet endnu
        console.log('created: data er klar')
    },
    mounted() {
        // DOM'en er tegnet - godt sted at hente data
        console.log('mounted: appen er på siden')
        this.fetchUsers()
    },
})

// =============================================================
//  KOMPONENT - genbrugelig byggeklods med props, emits og slot
// =============================================================
app.component('info-card', {
    props: {
        title: { type: String, required: true },
        count: { type: Number, default: 0 },
    },
    emits: ['clicked'],
    template: `
        <div class="card">
            <h3>{{ title }}</h3>
            <p>Count fra forælder: {{ count }}</p>
            <slot>Standard-indhold hvis der ikke sendes noget ind</slot>
            <button @click="$emit('clicked', title)">Send event op</button>
        </div>
    `,
})
