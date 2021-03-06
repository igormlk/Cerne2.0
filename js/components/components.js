class Card{
    constructor(id,front,back, score = 1){
        this.id = id
        this.front = JSON.parse(JSON.stringify(front))
        this.back = JSON.parse(JSON.stringify(back))
        this.score = score
    }
    getHtml(){
        return '<li id='+this.id+'>'+this.front+'</li>'
    }
    getHtmlStore(){
        return '<li id='+this.id+'>'+this.front+'</li>'
    }
    setId(id){this.id=id}
    setFront(front){this.front=front}
    setBack(back){this.back=back}
    setScore(score){this.score = score}
    getId(){return this.id}
    getFront(){return this.front}
    getBack(){return this.back}
    getScore(){return this.score}

}

class CardSide{
    constructor(text='',size=20,color='#000',style='Comfortaa'){
        this.text = text
        this.size = size
        this.color = color
        this.style = style
    }
    setText(text){this.text=text}
    setSize(size){this.size=size}
    setColor(color){this.color=color}
    setStyle(style){this.style=style}
    getText(){return this.text}
    getSize(){return this.size}
    getColor(){return this.color}
    getStyle(){return this.style}
}

class Deck {
    constructor(id,title = 'Sem nome', score = 0, category, cards = [], cardNumber = 0){
        this.id = id;
        this.title = title;
        this.score = score;
        this.category = category;
        this.cards = cards
        this.cardNumber = cardNumber;
    }

    add(){
        $('#' + this.category).find('ul').append(this.getHtml())
    }

    pushCard(card){
        this.cards.push(card)
        this.cardNumber++
    }

    save(){
        if(!this.cards.length){
            //Deseja realmente sair?
            Screens.navigate(Home)
            return
        }
        this.setId(generateUniqueKeyFirebase())
        writeFirebase("/decks/" + this.getId(), this)
        SignIn.addDeck(this.getId())
        updateFirebase("/users/" + SignIn.getId(), SignIn.getState())
        Home.addDeck(this)
        Screens.navigate(Home)
    }

    update(){
        updateFirebase("/decks/" + this.getId(), this)
    }

    read(){
        return readFirebase("/decks/"+this.getId(),function(snapshot){
            return snapshot.val()
        })
    }

    getStars(score){
        let full = score
        let empty = (5-score)

    }

    getHtml(){
       return ('<li class="deck" id="'+this.id+'" onClick=(Study.startStudy(this.id))><h1 class="deck-title">'+this.title+'</h1><div class="info"><h2 class="deck-length">'+this.cards.length+'</h2></div></li>')
    }

    setId(id){this.id=id}
    setTitle(title){this.title=title}
    setScore(score){this.score=score}
    setCardNumber(number){this.cardNumber=number}
    setCategory(category){this.category=category}
    setCards(cards){this.cards=cards}
    getId(){return this.id}
    getTitle(){return this.title}
    getScore(){return this.score}
    getCardNumber(){return this.cardNumber}
    getCategory(){return this.category}
    getCards(){return this.cards}
}

class Category{
    constructor(id = 'nocategory', title = 'Sem Categoria', list = 'collection'){
        this.id = id;
        this.title = title;
        this.list = list
    }

    getHtml(){
        return('<li class="deck-category" id="'+this.id+'"><h1>'+this.title+'</h1><ul class="category-container"></ul></li>')
    }

    addAll(){
        this.add();
        this.decks.map(function(deck){
            deck.add();
        });
    }

    save(){

    }

    pushDeck(deck){
        deck.setCategory(this.id);
        this.decks.push(deck)
    }

    setId(id){this.id=id}
    setTitle(title){this.title=title}
    setDecks(decks){this.decks=decks}
    getId(){return this.id}
    getTitle(){return this.title}
    getDecks(){return this.decks}
}

const FontSlider = {
        field: '#font-size',
        textField:'#card-text',
        circle: '#font-size-circle',
        mov: 0,
        max: 0,
        min: 0,
        fontMin: 20,
        fontMax : 45,
        //factor: 0,
        range: 0,
        currentSize: 20,
        factor(){return((this.fontMax - this.fontMin) / this.max)},
        move(x){
            this.mov = x-this.min;
            if(this.mov <= 0)
                this.mov = 0
            if(this.mov >= this.max)
                this.mov = this.max
            $(this.circle).css({'transform': 'translateX('+ this.mov +'px)'})
            this.fontSize()
        },
        fontSize(){
            this.range = this.fontMax - this.fontMin
            let factor = (this.range / this.max)
            this.currentSize = (((this.mov * factor) + this.fontMin))
            $(this.textField).css({'font-size': this.currentSize + 'px'})
        },
        setSize(size){
            this.currentSize = size
            $(this.textField).css({'font-size': this.currentSize + 'px'})
            this.mov = ((this.currentSize - this.fontMin) / this.factor())
            $(this.circle).css({'transform': 'translateX('+ this.mov +'px)'})
        },
        render(){
            this.max = $(this.field).width() - $(this.circle).width()
            this.min = $(this.field).position().left + 12
        }
    }

const FontStyle = {
        field:'#font-style',
        cardField: '#card-text',
        currentFontIndex: 0,
        fonts:['Abel', 'Comfortaa','Alex', 'Berkshire','PermanentMarker'],
        next(){
            this.currentFontIndex = (this.currentFontIndex + 1 >= this.fonts.length) ? 0 : this.currentFontIndex + 1
            $(this.cardField).css({'font-family': this.fonts[this.currentFontIndex]})
            $(this.field).css({'font-family': this.fonts[this.currentFontIndex]})
        },
        setStyle(index){
            this.currentFontIndex = index
            $(this.cardField).css({'font-family': this.fonts[index]})
            $(this.field).css({'font-family': this.fonts[index]})
        },
        getStyle(){
            return this.fonts[this.currentFontIndex];
        },
        getFont(index){
            return this.fonts[index]
        }
    }

const FontColor = {
        field:'#font-color',
        cardfield: '#card-text',
        currentColor: '#000',
        markers: ['red','yellow', 'orange', 'green','blue','pink','purple'],
        setColor(color){
            $(this.cardfield).removeClass()
            $(this.cardfield).css(this.getColorTheme(color))
        },
        getColor(){
            return this.currentColor
        },
        getColorCode(color){
            return $('.'+color).css('background-color')
        },
        getColorTheme(color){
            this.currentColor = this.getColorCode(color)
            let font = (color == 'yellow' || color == 'orange' || color == 'pink') ? '#000' : '#FFF'
            let colorScheme = (this.markers.includes(color) ? {'background-color':this.currentColor,'color' : font} : {'color':this.currentColor, 'background-color' : '#FFF'})

            if($('body').hasClass('dark')&&this.currentColor == 'rgb(255, 255, 255)')
                colorScheme = {'background-color':'transparent','color' : font}

            if(!($('body').hasClass('dark'))&&this.currentColor == 'rgb(0, 0, 0)')
                colorScheme = {'background-color':'transparent','color' : font}

            return colorScheme
        }
    }

const FlashcardCreator = {
        field:'#flashcard-creator',
        flipField:'#flashcard-creator-flip',
        inputField:'#card-input',
        textField:'#card-text',
        currentSide: 1,
        front: {text:'',size:20, color:'black', style:0},
        back: {text:'',size:20, color:'black', style:0},
        flip(){
            this.currentSide = (!this.currentSide);
            let side = this.getSide()
            $(this.inputField).val(side.text)
            $(this.textField).text(side.text)
            flashcardFlip.play()
            FontStyle.setStyle(side.style)
            FontColor.setColor(side.color)
            FontSlider.setSize(side.size)
        },
        write(text){
            $(this.textField).text(text)
            if(this.currentSide){
                this.front.text = text
                return
            }
            this.back.text = text
        },
        setColor(color){
            if(this.currentSide){
                this.front.color = color
                return
            }
            this.back.color = color
        },
        setSize(size){
            if(this.currentSide){
                this.front.size = size
                return
            }
            this.back.size = size
        },
        setStyle(style){
            if(this.currentSide){
                this.front.style = style
                return
            }
            this.back.style = style
        },
        getSide(){
            return (this.currentSide) ? this.front : this.back
        },
        isWritten(){
            return !(this.front.text == '' || this.back.text == '')
        },
        erase(){
            this.currentSide = 1
            this.write('')
            this.setColor('black')
            this.setSize(20)
            this.setStyle(0)
            this.back.text = ''
            $(this.inputField).val('')
        }
    }

const categorys = [
    new Category(0,'Português','collection'),
    new Category(1,'Matemática','collection'),
    new Category(2,'Idiomas','collection'),
    new Category(3,'Biologia','collection'),
    new Category(4,'Esportes','collection'),
    new Category(5,'Física','collection'),
    new Category(6,'Química','collection'),
    new Category(7,'Geografia','collection'),
    new Category(8,'História','collection'),
    new Category(9,'Literatura','collection'),
    new Category(10,'Artes','collection'),
    new Category(11,'Música','collection'),
    new Category(11,'Tecnologia','collection'),
    new Category(9999,'Nova Categoria','collection'),
]

const CategorySelector = {
    field: '#category-selector',
    selected: new Category(-1),
    categorys: categorys,
    setCategory(category){
        $(this.field).find('#' + this.selected.id).removeClass('selected')
        this.selected = category
        $(this.field).find('#' + category.id).addClass('selected')
    },
    getCategory(){
        return this.selected
    },
    pushCategory(category){
        this.categorys.push(category)
    },
    getItemHtml(id, description){
        return '<li id='+id+'>'+description+'</li>'
    },
    render(){
        $(this.field).empty()
        this.categorys.map((category)=>{
            $(this.field).append(this.getItemHtml(category.id, category.title))
        })
        $(this.field).find('li').click(function(e){
            CategorySelector.setCategory(new Category(e.currentTarget.id,($(e.currentTarget).text())))
        });
    }
}

const DarkMode = {
    field: '#dark-mode',
    state: {
        status: false
    },
    toggle(){
        let y = $(this.field).position().top + 20
        let x = $(this.field).position().left + 20
        burst.tune({x:x,y:y});
        this.state.status = !this.state.status
        $(this.field).attr('src',(this.state.status) ? 'img/moon-on.svg' : 'img/moon-off.svg')
        $('body').toggleClass('dark')
        darkModeAnimation.replay()
    },
    activate(isEnable){

        let y = $(this.field).position().top + 20
        let x = $(this.field).position().left + 20
        burst.tune({x:x,y:y});
        this.state.status = isEnable
        $(this.field).attr('src',(this.state.status) ? 'img/moon-on.svg' : 'img/moon-off.svg')

        if(isEnable){
            $('body').addClass('dark')
            darkModeAnimation.replay()
        }else{
            $('body').removeClass('dark')
            darkModeAnimation.replay()
        }

    }
}

const CardScroll = {
    field :'#card-scroll',
    fieldList: '#card-scroll ul',
    fieldCards: '#card-scroll ul li',
    cardsNumber: 5,
    state: {
        currentCard:{},
        style:{
            color: '#000',
            size: '20',
            style: 'Comfortaa',
        },
        cards: [],
    },
    iniciate(){
        $(this.fieldList).empty()
        let blankCard = new Card('blank', new CardSide(''), new CardSide(''))
        let beginningCard = new Card('blank', new CardSide('Vamos começar!'), new CardSide('Esse é o seu deck de ' + Study.state.deck.title))
        let i;
        for (i = 0; i < this.cardsNumber; i++) {
            $(this.fieldList).append(this.getCardHtml(blankCard))
        }
        this.rewriteCard(4, beginningCard)
        this.carrousselCards();
        this.carrousselArray(true)
    },
    carrousselArray(remembered){
        if (remembered){
            this.state.cards.push(this.state.cards.shift())
            return
        }

        this.state.cards.splice(Math.floor(Math.random() * Math.ceil(this.state.cards.length/2)) + 1 ,0,(this.state.cards.shift()))
    },
    carrousselCards(){
        this.state.currentCard = this.state.cards[this.state.cards.length - 1]
        this.rewriteCard(3, this.state.cards[0])
        this.repaintCard(3, this.state.cards[0])
    },
    rewriteCard(pos, card){
        $(this.fieldCards + ":nth-child("+pos+") .front").find('h1').text(card.front.text)
        $(this.fieldCards + ":nth-child("+pos+") .back").find('h1').text(card.back.text)
    },
    repaintCard(pos, card){
        $(this.fieldCards + ":nth-child("+pos+") .front").find('h1').css({
            'font-size':Math.ceil(card.front.size),
            'font-family':FontStyle.getFont(card.front.style)}).css(FontColor.getColorTheme(card.front.color))
        $(this.fieldCards + ":nth-child("+pos+") .back").find('h1').css({
            'font-size':Math.ceil(card.back.size),
            'font-family':FontStyle.getFont(card.back.style)}).css(FontColor.getColorTheme(card.back.color))
    },
    pushCard(){
        this.animate()
        this.carrousselCards()
    },
    pushLeft(){
        $(this.field).removeClass('remembered')
        this.pushCard()
        this.carrousselArray(false)
        forgetButtonAnimation.replay()
    },
    pushRight(){
        $(this.field).addClass('remembered')
        this.pushCard()
        this.carrousselArray(true)
        rememberButtonAnimation.replay()
    },
    animate(){
        $(this.fieldCards + ":nth-child(5)" ).insertBefore( $(this.fieldCards + ":nth-child(1)"));
    },
    setCards(cards){
        this.state.cards = cards
        this.iniciate()
    },
    getCardHtml(card){
        return '<li><div class="flip" id="' + card.id + '"><div class="front card"><h1>'+card.front.text+'</h1></div><div class="back card"><h1>'+card.back.text+'</h1></div></li>'
    }
}

const Store = {
    id:'',
    state: {
      decks: []
    },
    getStoreDecks(){

        readFirebase("/decks/", function(snapshot){

        var returnArr = [];

        snapshot.forEach(function(result) {

            let item = result.val();
            item.id = result.key;

            if(item.category.list == 'store'){
                Home.addStoreDeck(new Deck(item.id,item.title, item.score, item.category, item.cards, item.cardNumber))
            }
        });

         return returnArr
        })
    }
}
