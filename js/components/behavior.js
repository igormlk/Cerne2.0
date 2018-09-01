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
        state.newDeck.pushCard(new Card(generateUniqueKeyFirebase(),FlashcardCreator.front,FlashcardCreator.back))
        FlashcardCreator.erase()
        newFlashcardAnimation.play()
    })

    $('#fin-deck').click(function(e){
        state.newDeck.save();
        state.newDeck = new Deck
    })

    $('#remembered').click(function(e){
        CardScroll.pushRight()
    })

    $('#forgot').click(function(e){
        CardScroll.pushLeft()
    })

    $('#flip-card').click(function(e){
        flipStudyAnimation.replay()
         $("#card-scroll ul li:nth-child(4)").find('.flip').toggleClass("is-flipped")
    })

    $('#edit-card').click(function(e){
        updateFirebase('/decks/'+Study.state.deck.id, Study.state.deck);
        Screens.navigate(Study)
    })

    $('#edit-card-header').click(function(e){
        let y = $(this).position().top + 27
        let x = $(this).position().left + 27
        burst.tune({x:x,y:y});
        burst.replay()
        setTimeout(()=>{CardEditor.editCard(CardScroll.state.currentCard)},500)
    })

    $('#' + DeckEditor.btnSaveDeck).click(function(e){
        if ($('#new-deck-name').val() == ''){
            alert('Digite o nome do deck!')
            return
        }
        if (CategorySelector.getCategory() == -1){
            alert('Selecione uma categoria!')
            return
        }
        Study.state.deck.setTitle($('#new-deck-name').val())
        Study.state.deck.setCategory(CategorySelector.getCategory())
        Study.state.deck.update()

        if($('#'+Study.state.deck.id).parent().parent().attr('id') != Study.state.deck.category.id){
            Home.resetList()
            Screens.navigate(Study)
            return
        }

        let find = Home.state.userDecks.find((x)=> x.id == Study.state.deck.id)
        Home.state.userDecks[Home.state.userDecks.indexOf(find)] = Study.state.deck
        $('#'+Study.state.deck.id).find('.deck-title').text(Study.state.deck.title)
        Screens.navigate(Study)
    })

});

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(navigator.camera);
}
