const Screens = {
    screens: ['home','sign-in','sign-up','on-boarding','deck-creator','card-creator', 'cards-preview','settings'],
    stack: [],
    navigate(screen){
        this.screens.map(function(screen){
            $('#'+screen).addClass('hide')
        })
        screen.render()
        screen.show()
    }
}

const SignIn = {
    id: 'sign-in',
    state:{
        user:'',
        password:''
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){

    },
    signIn(){
        if(this.state.user == '' || this.state.password == ''){
            alert('Preencha todos os campos de login!')
            return
        }
        //Aqui vem a requisição, quando completada, o setUserName recebe o nome do usuário
        //Se tiver foto e/ou decks, setar aqui tbm
        //Home.setUserAvatar(caminho da imagem)
        //Home.serUserDecks(array de objetos Deck)
        Home.setUserName(this.state.user)
        Screens.navigate(Home)
    },
    setUser(user){
        this.state.user = user
    },
    setPassword(password){
        this.state.password = password
    }
}

const SignUp = {
    id: 'sign-up',
    state:{
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
    }
}

const CardsPreview = {
    id: 'cards-preview',
    state:{
        deck: {id: 'undefined', title: "Sem nome", score: 0, category: 'undefined', cards: []},
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
        this.state.cards.map((card)=>{
            this.addCard(card)
        })
    },
    addCard(card){

    }
}

const Home = {
    id: 'home',
    state:{
        userAvatar: 'img/logocerne.png',
        userName: '',
        userDecks: [],
        userPk: ''
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
        $('#user-name').text(this.state.userName)
        $('#user-decks-number').text(this.state.userDecks.length)
        $('.profile-pic').css({'background-image':'url(' + this.state.userAvatar + ')'})
        $('#blured-image').css({'background-image':'url(' + this.state.userAvatar + ')'})

        if(this.state.userDecks.length == 0 || this.state.userDecks.length == $('#collection').find('.deck').length)
            return

        this.state.userDecks.map((deck)=>{
            this.addDeck(deck)
        })
    },
    addCategory(category){
        if(Home.state.userDecks.find((x)=> x.category.id == category.id) != undefined)
            return
        $('#' + category.list).find('.deck-container').append(category.getHtml())
    },
    addDeck(deck){
        this.addCategory(deck.category)
        this.state.userDecks.push(deck)
        $('#' + deck.category.id).find('ul').append(deck.getHtml())
    },
    setUserName(name){
        this.state.userName = name
    },
    setUserAvatar(avatar){
        this.state.userAvatar = avatar
    },
    setUserDecks(decks){
        this.state.userDecks = decks
    },
    setUserPk(pk){
        this.state.userPk = pk
    },
}

const DeckCreator = {
    id: 'deck-creator',
    state:{
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
        $('#new-deck-name').val('')
        CategorySelector.render()
    }
}

const CardCreator = {
    id: 'card-creator',
    state:{
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
    }
}

const Settings = {
    id: 'settings',
    state:{
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
    }
}

$(document).ready(function(){
   Screens.navigate(SignIn)
});
