let state = {
    newDeck: new Deck()
}

$(document).ready(function(){
    FontSlider.render()

    $(DarkMode.field).click(function(e){
        DarkMode.toggle()
    })

    $('#new-deck').click(function(){
        newDeckButtonAnimation.replay()
        setTimeout(()=>{Screens.navigate(DeckCreator)},500)
    });

    $('#collection-nav').click(function(){
        if($('#'+this.id).hasClass('selected'))
            return

        $('#store-nav').removeClass('selected')
        $('#store').addClass('hide')
        $('#' + this.id).addClass('selected')
        $('#collection').removeClass('hide')
    });

    $('#store-nav').click(function(){
        if($('#'+this.id).hasClass('selected'))
            return

        $('#collection-nav').removeClass('selected')
        $('#collection').addClass('hide')
        $('#' + this.id).addClass('selected')
        $('#store').removeClass('hide')
    });

    $(FontSlider.field).on('mousemove',function(e){
        FontSlider.move(e.pageX)
        FlashcardCreator.setSize(FontSlider.currentSize)
    });

    $(FontStyle.field).click(function(){
        FontStyle.next()
        FlashcardCreator.setStyle(FontStyle.currentFontIndex)
    });

    $(FontColor.field).find('li').click(function(e){
        FontColor.setColor(e.currentTarget.className)
        FlashcardCreator.setColor(e.currentTarget.className)
    });

    $(FlashcardCreator.field).click(function(e){
        if (e.target.id == 'flashcard-creator-flip')
            return
        $(FlashcardCreator.inputField).focus()
    });

    $(FlashcardCreator.flipField).click(function(){
        FlashcardCreator.flip()
    });

    $(FlashcardCreator.inputField).on('input',function(e){
        FlashcardCreator.write($(FlashcardCreator.inputField).val())
    });

    $('#create-deck').click(function(e){
        if ($('#new-deck-name').val() == ''){
            alert('Digite o nome do deck!')
            return
        }
        if (CategorySelector.getCategory() == -1){
            alert('Selecione uma categoria!')
            return
        }

        state.newDeck.setTitle($('#new-deck-name').val())
        state.newDeck.setCategory(CategorySelector.getCategory())
        Screens.navigate(CardCreator)
        FontSlider.render()

    })

    $('#add-card').click(function(e){
        if(!FlashcardCreator.isWritten()){
            alert('O flashcard ainda possui algum lado em branco!')
            return
        }
        state.newDeck.pushCard(new Card(0,FlashcardCreator.front,FlashcardCreator.back,FlashcardCreator))
        FlashcardCreator.erase()
        newFlashcardAnimation.play()
    })

    $('#fin-deck').click(function(e){
        if(!state.newDeck.cards.length){
            //Deseja realmente sair?
            Screens.navigate(Home)
            return
        }
        Home.addDeck(state.newDeck)
        state.newDeck = new Deck
        Screens.navigate(Home)
    })
});

