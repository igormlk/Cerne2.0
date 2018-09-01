const Screens = {
    screens: ['home','sign-in','sign-up','on-boarding','deck-creator','card-creator', 'cards-preview','settings', 'study'],
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
        id:'',
        name:'',
        email:'',
        password:'',
        password_confirm:'',
        photo:'img/logocerne-min.png',
        decks: [],
        preferences: {
            darkMode: {
                status: false
            }
        }
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){

    },
    signIn(email, password){
        if(this.state.email == '' || this.state.password == ''){
            toastShowMessageLongBottom('Preencha todos os campos de login!')
            console.log('Preencha todos os campos de login!')
            return
        }
        //Aqui vem a requisição, quando completada, o setUserName recebe o nome do usuário
        //Se tiver foto e/ou decks, setar aqui tbm
        //Home.setUserAvatar(caminho da imagem)
        //Home.serUserDecks(array de objetos Deck)

        firebase.auth().signInWithEmailAndPassword(this.state.email.trim(),this.state.password).
        then(function(user){
            SignIn.setId(user.user.uid);
            readFirebase("/users/"+SignIn.getId(), function(snapshot){
                SignIn.setState(snapshot.val())
                toastShowMessageLongBottom("Bem Vindo")
                Home.setUserName(SignIn.getName())
                Home.setUserPk(SignIn.getId())
                Home.setUserAvatar(SignIn.state.photo, true)
                let deck = null
                let len = SignIn.getDecks() != null ? SignIn.getDecks().length : 0
                for(let i = 0; i < len; i++){
                    deck = new Deck
                    deck.setId(SignIn.getDecks()[i])
                    deck.read().then(function (result){
                        Home.addDeck(new Deck(result.id,result.title, result.score, result.category, result.cards, result.cardNumber))
                    });
                }
                Store.getStoreDecks()
                DarkMode.activate(SignIn.state.preferences.darkMode.status)
                Screens.navigate(Home)
            });
        }).catch(function(error) {
        // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;

            console.log("ERROR = " + errorCode + "\nErrorMessage" + errorMessage);
            toastShowMessageLongBottom(errorMessage);
        });
    },
    setEmail(email){
        this.state.email = email
    },
    setPassword(password){
        this.state.password = password
    },
    setId(id){
        this.state.id = id
    },
    getId(){
        return this.state.id
    },
    setState(state){
        this.state = state
    },
    getState(){
        return this.state;
    },
    getName(){
        return this.state.name
    },
    setName(name){
        this.state.name = name
    },
    logoutUser(){
        firebase.auth().signOut().then(function() {
            console.log("Deslogou");
        }).catch(function(error) {
            console.log(error);
        });
    },
    addDeck(deck){
        if(this.state.decks == null)
            this.state.decks = []
        this.state.decks.push(deck)
    },
    getDecks(){
        return this.state.decks;
    },
    update(){
        updateFirebase("/users/"+this.state.id, this.state)
    }
}

const SignUp = {
    id: 'sign-up',
    state:{
        id:'',
        name:'',
        email:'',
        password:'',
        password_confirm:'',
        photo:' ',
        decks:[],
        preferences: {
            darkMode: {
                status: false
            }
        }
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
    },
    setName(name){
        this.state.name = name
    },
    setPassword(password){
        this.state.password = password
    },
    setConfirmPassword(password){
        this.state.password_confirm = password
    },
    setEmail(email){
        this.state.email = email
    },
    setPhoto(photo){
        this.state.photo = photo
    },
    setId(id){
        this.state.id = id;
    },
    getId(){
        return this.state.id;
    },
    getState(){
        return this.state;
    },
    isSignUpValid(){

        if(this.state.email == ''){
            toastShowMessageLongBottom("Email Vazio");
            console.log("Email Vazio");
            return false;
        }
        if(this.state.name == ''){
            toastShowMessageLongBottom("Nome Vazio")
            console.log("Nome Vazio")
            return false;
        }
        if(this.state.password == ''){
            toastShowMessageLongBottom("Senha Vazia")
            console.log("Senha Vazia")
            return false;
        }
        if(this.state.password != this.state.password_confirm){
            toastShowMessageLongBottom("Senhas Diferentes")
            console.log("Senhas Diferentes")
            return false;
        }

        return true;
    },
    signUp(){
        if(!this.isSignUpValid())
            return;

        firebase.auth().createUserWithEmailAndPassword(
        this.state.email.trim(),this.state.password).then(function(user){
            console.log(user.user.uid);
            SignUp.setId(user.user.uid);
            writeFirebase("/users/" + SignUp.getId(), SignUp.getState());
            toastShowMessageLongBottom("Usuario cadastrado com sucesso");
            console.log("Usuario cadastrado com sucesso");
            Screens.navigate(SignIn);
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error code=" + errorCode)
            console.log("Message Error="+ errorMessage)
            toastShowMessageLongBottom(errorMessage)
        });

    }

}

const Study = {
    id: 'study',
    state:{
        deck: {id: 'undefined', title: "Sem nome", score: 0, category: 'undefined', cards: []},
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
        CardScroll.setCards(this.state.deck.cards)
        $('#study-deck-name').text(this.state.deck.title)

        if(this.state.deck.category.list == 'store'){
            $('#study-deck-name').removeAttr('onclick')
            $('#edit-card-header').addClass('hide')
        }else{
            $('#study-deck-name').attr('onclick', 'DeckEditor.startDeckEditor()')
            $('#edit-card-header').removeClass('hide')
        }

    },
    addCard(card){

    },
    setDeck(deck){
        this.state.deck = deck
    },
    setDeckTitle(title){
        this.state.deck.title = title
    },
    startStudy(id){
        this.setDeck(Home.getDeck(id))
        Screens.navigate(this)
    }
}

const Home = {
    id: 'home',
    state:{
        userAvatar: ' ',
        userName: '',
        userDecks: [],
        storeDecks:[],
        userPk: ''
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
        $('#user-name').text(this.state.userName)
        $('#user-decks-number').text(this.state.userDecks.length)
        $('.profile-pic').css({'background-image':'url(data:image/jpeg;base64,' + this.state.userAvatar + ')'})
        $('#blured-image').css({'background-image':'url(' + this.state.userAvatar + ')'})

        if(this.state.userDecks.length != 0 && this.state.userDecks.length != $('#collection').find('.deck').length){

            this.state.userDecks.map((deck)=>{
            this.addDeck(deck)
            })

        }
        else if(this.state.storeDecks.length != 0 && this.state.storeDecks.length != $('#store').find('.deck').length){

            this.state.storeDecks.map((deck)=>{
            this.addStoreDeck(deck)
            })

        }


    },
    resetList(){
        $('#collection').find('.deck-container').empty()
        $('#store').find('.deck-container').empty()
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
        this.addCategory(new Category(deck.category.id, deck.category.title, deck.category.list))
        this.state.userDecks.push(deck)
        $('#user-decks-number').text(this.state.userDecks.length)
        $('#' + deck.category.id).find('ul').append(deck.getHtml())
    },
    addStoreDeck(deck){
        this.addCategory(new Category(deck.category.id, deck.category.title, deck.category.list))
        this.state.storeDecks.push(deck)
        $('#' + deck.category.id).find('ul').append(deck.getHtml())
    },
    getDeck(id){
        let a = this.state.userDecks.filter((x)=>x.id == id)[0]
        if(a == undefined)
            return this.state.storeDecks.filter((x)=>x.id == id)[0]
        else
            return a
    },
    setUserName(name){
        this.state.userName = name
    },
    setUserAvatar(avatar, base64){
        this.state.userAvatar = avatar
    },
    setUserDecks(decks){
        this.state.userDecks = decks
    },
    setUserPk(pk){
        this.state.userPk = pk
    },
    getUserPk(){
        return this.state.userPk
    }
}

const DeckCreator = {
    id: 'deck-creator',
    btnSaveDeck:'save-deck',
    btnCreateDeck:'create-deck',
    state:{
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
        $('#' + this.btnSaveDeck).addClass('hide')
        $('#' + this.btnCreateDeck).removeClass('hide')
        $('#new-deck-name').val('')
        CategorySelector.render()
    }
}

const DeckEditor = {
    id: 'deck-creator',
    btnSaveDeck:'save-deck',
    btnCreateDeck:'create-deck',
    state:{
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
        $('#new-deck-name').val(Study.state.deck.title)
        $('#' + this.btnSaveDeck).removeClass('hide')
        $('#' + this.btnCreateDeck).addClass('hide')
        CategorySelector.render()
    },
    startDeckEditor(){
        Screens.navigate(this)
        CategorySelector.setCategory(Study.state.deck.category)
    }
}

const CardCreator = {
    id: 'card-creator',
    idEditCard: 'edit-card',
    state:{},
    show(){
        $('#' + this.id).removeClass('hide')
        $('#' + this.idEditCard).addClass('hide')
    },
    render(){
    }
}

const CardEditor = {
    id: 'card-creator',
    idAddCard: 'add-card',
    idEditCard: 'edit-card',
    idFinCard:'fin-deck',
    state:{
        card: null
    },
    show(){
        $('#' + this.id).removeClass('hide')
        FontSlider.render()
        FontSlider.setSize(FontSlider.currentSize)
    },
    render(){
        FlashcardCreator.flip()
        FlashcardCreator.flip()
        $('#' + this.idEditCard).removeClass('hide')
        $('#' + this.idAddCard).addClass('hide')
        $('#' + this.idFinCard).addClass('hide')
        $('#' + this.idFinCard).addClass('hide')
    },
    editCard(card){
        this.state.card = card
        FlashcardCreator.front = this.state.card.front
        FlashcardCreator.back = this.state.card.back
        Screens.navigate(this)
    },
    save(){

    }
}

const Settings = {
    id: 'settings',
    state:{
        name:'',
        password:'',
        confirmPass:''
    },
    show(){
        $('#' + this.id).removeClass('hide')
    },
    render(){
        $('#new-user-name-settings').text('')
        $('#new-user-password-settings').text('')
        $('#new-user-password-confirmation-settings').text('')
    },
    save(){
        if(this.state.password != this.state.confirmPass){
            console.log("As Senhas não correspondem")
            toastShowMessageLongBottom("As senhas não correspondem")
            return;
        }

        let user = SignIn.getState()
        user.name = this.state.name
        user.password = this.state.password
        user.password_confirm = this.state.confirmPass
        user.preferences.darkMode = DarkMode.state
        firebase.auth().currentUser.updatePassword(this.state.password)
        updateFirebase("/users/" + user.id, user);
        toastShowMessageLongBottom("Alterações feitas com sucesso")
        Home.setUserName(user.name)
        Screens.navigate(Home)
    },
    setName(name){
        this.state.name = name
    },
    setPassword(password){
        this.state.password = password
    },
    setConfirmPassword(password){
        this.state.confirmPass = password;
    }

}

$(document).ready(function(){
   Screens.navigate(SignIn)
});
