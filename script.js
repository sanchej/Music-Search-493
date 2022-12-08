
const { createApp } = Vue
createApp({
    data() {
        return {
            text: '',
            data_arr: null,
            data_show: null,
            Found_num: 0,
            Genres: [],
            ShownGenres: [],
            ddmr: true,
            ddmp: false,
            ddmn: false,
        }
    },
    methods: {
        //[{“genre”: genre name, “shown”: true},...]
        async keyPressRouter(event) {
            switch (event.which) {
                case 13:
                    let temp = [];
                    await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(this.text)}&media=music`).then(res => res.json())
                        .then(function (result) {
                            temp = result;
                        });
                    console.log(temp);
                    this.data_arr = temp.results;
                    this.data_show = this.data_arr;
                    this.Found_num = temp.results.length;
                    const unique = (value, index, self) => {
                        return self.indexOf(value) === index
                    }
                    let count = 0;
                    this.data_arr.forEach(element => {
                        this.Genres.push(element.primaryGenreName);
                        element.InfoTab = false;
                        element.count = count;
                        count++;
                    });
                    this.Genres = this.Genres.filter(unique);
                    for (let j = 0; j < this.Genres.length; j++) {
                        let data_point = { "genre": this.Genres[j], "shown": false };
                        this.ShownGenres.push(data_point);
                    }
                    if (this.Found_num == 0) {
                        alert("No artists were found");
                    }
                    break;
            }
        },
        KEYCHANGE(x) {
            if (x == 'collectionPrice') {
                this.data_arr.sort((a, b) => a.collectionPrice - b.collectionPrice);
                this.ddmr = false;
                this.ddmp = true;
                this.ddmn = false;
            }
            if (x == 'collectionName') {
                this.data_arr.sort((a, b) => (a.collectionName > b.collectionName) ? 1 : ((b.collectionName > a.collectionName) ? -1 : 0));
                this.ddmr = false;
                this.ddmp = false;
                this.ddmn = true;
            }
            if (x == '') {
                this.data_arr.sort((a, b) => a.count - b.count);
                this.ddmr = true;
                this.ddmp = false;
                this.ddmn = false;
            }

            this.data_arr.forEach(element => {
                element.InfoTab = false;
            });
            let temp = [];
            for (let j = 0; j < this.Genres.length; j++) {
                if (this.ShownGenres[j]) {
                    temp.push(this.Genres[j]);
                }
            }
            this.data_show = this.data_arr.filter(collections => temp.includes(collections.primaryGenreName));
        },
        GenreChange(input) {
            this.ShownGenres.forEach(el => {
                if (el.genre == input) {
                    if (el.shown) {
                        el.shown = false;
                    }
                    else {
                        el.shown = true;
                    }
                }
            });
            let temp = [];
            for (let j = 0; j < this.ShownGenres.length; j++) {
                if (this.ShownGenres[j].shown) {
                    temp.push(this.ShownGenres[j].genre);
                }
            }
            this.data_show = this.data_arr.filter(collections => temp.includes(collections.primaryGenreName));
        },
        GenreChangeAll() {
            this.ShownGenres.forEach(x => { x.shown = false });
            this.data_show = this.data_arr;
        },
    }
}).mount('#app')
//document.getElementById('app').__vue_app__._instance.data
//document.getElementById('app').__vue_app__._instance.data.data_arr = ans;


// Active tabs, Active Dropdown selection, Active filter selection

