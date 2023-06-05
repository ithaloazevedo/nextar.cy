// Importando fixtures com dados da loja
const loja = require('../fixtures/store.json');
describe('Homepage', () => {
  //Settando viewport e visitando a página "Loja Qualificação"
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit('')
  });

  it('Validar informações da loja', () => {
    console.log(loja)
    // Logo da loja visível
    cy.get('.nex-sidebar__store-profile > .ui')
      .should('be.visible')
    // Título da página
    cy.title().should('be.equal', loja.titulo)
    // Nome da loja 
    cy.get('.nex-sidebar__store-profile__name')
      .should('have.text', loja.nome)

    // Telefone da loja
    cy.get(':nth-child(1) > .content > a')
      .should('have.text', loja.telefone)
    // Redes sociais da loja
    cy.get(':nth-child(2) > .content > a')
      .should('have.text', loja.facebook)
    cy.get(':nth-child(3) > .content > a')
      .should('have.text', loja.instagram)
    cy.get(':nth-child(4) > .content > a')
      .should('have.text', loja.email)
    // Endereço da loja
    cy.get(':nth-child(5) > .content > a')
      .should('have.text', loja.endereco)
    // Sobre nós
    cy.get('.computer > .about')
      .should('have.text', loja.sobre)
  });
  it('Ordenar produtos pelo menor preço', () => {
    // Clicando no tipo de ordenação...
    cy.get('.divider').click()
    // ... e escolhendo o filtro "Menor Preço"
    cy.contains('span', 'Menor Preço').click()

    // Verificando se o filtro Menor Preço foi aplicado
    cy.get('.divider').should('have.text', 'Menor Preço')
    //Obtendo o valor do preço do Produto 1
    cy.get('.list-product__grid-column__div-section__price__current')
      .eq(0)
      .then((temp) => {
        // Transformando o preço de string para float
        let preco = temp.text().replace(/[^\d,]+/g, '')
        const preco1 = parseFloat(preco)

        //Obtendo o valor do preço do Produto 2
        cy.get('.list-product__grid-column__div-section__price__current')
          .eq(1)
          .then((temp) => {
            let preco = temp.text().replace(/[^\d,]+/g, '')
            const preco2 = parseFloat(preco)

            // Verificando se o preço do primeiro produto é menor ou igual ao do segundo
            expect(preco1).to.be.at.most(preco2)
          })
      })
  });

  context('Sacola', () => {
    beforeEach(() => {
      // Obtendo preço e nome do primeiro produto da PLP
      cy.get('.list-product__grid-column__title')
        .eq(0)
        .invoke('text')
        .then(() => { })
        .as('NomeProduto1')
      cy.get('.list-product__grid-column__div-section__price__current')
        .eq(0)
        .invoke('text')
        .then(() => { })
        .as('PrecoProduto1')
    });
    it('Adicionar produto à sacola pela PDP', function () {
      // Abrindo a PDP do primeiro produto da PLP
      cy.get('.list-product__grid-column__title')
        .eq(0)
        .click()
      // Verificando se o nome do produto na PDP é o mesmo da PLP
      cy.get('@NomeProduto1').then((str) => {
        cy.get('.product-detail__content__info__product_name')
          .should('have.text', str)
      })
      // Adicionando o produto à sacola
      cy.contains('Adicionar à sacola').click()
      // Verificando se o preço do produto na PDP é o mesmo da PLP
      cy.get('@PrecoProduto1').then((str) => {
        //Primeiro verifico o preço que aparece na PDP
        cy.get('.product-detail__content__info__price > data')
          .should('have.text', str)
        //Depois verifico o preço que aparece após adicionar o produto à sacola
        cy.get('.product-detail__content__info__counter-wrapper__price_qtd')
          .should('contain', str)
        // console.log('O preço do produto1 é ' + str)
      })
      // Clicando no botão da sacola
      cy.get('.product-detail__header-wrapper > .checkout > .checkout-button').click()
      // Validando se o elemento da sacola está visível
      cy.get('.cart-container').should('be.visible')
      // Validando se o nome e o preço do produto na sacola são os mesmos da PDP e da PLP
      cy.get('@NomeProduto1').then((str) => {
        cy.get('.flex > p').should('contain', str)
      })
      cy.get('@PrecoProduto1').then((str) => {
        cy.get('.content > p').should('contain', str)
      })
    });

    it('Adicionar produto à sacola pela PLP', () => {
      // Adicionando produto à sacola pelo botão '+' da PLP
      cy.get('.nex-icon-plus').eq(0).click()
      // Clicando no botão da sacola
      cy.get('.checkout-button').click()
      // Validando se o elemento da sacola está visível
      cy.get('.cart-container').should('be.visible')
      // Validando se o nome e o preço do produto na sacola são os mesmos da PLP
      cy.get('@NomeProduto1').then((str) => {
        cy.get('.flex > p').should('contain', str)
      })
      cy.get('@PrecoProduto1').then((str) => {
        cy.get('.content > p').should('contain', str)
      })
    });
    it('Remover produto da sacola', () => {
      // Adicionando produto à sacola
      cy.get('.list-product__grid-column__title')
        .eq(0)
        .click()
      cy.contains('Adicionar à sacola')
        .should('be.enabled')
        .click()
      // Clicando no botão da sacola
      cy.get('.product-detail__header-wrapper > .checkout > .checkout-button').click()
      // Verificando se o elemento da sacola está visível
      cy.get('.summary-header').should('be.visible')
      // Limpando a sacola
      cy.contains('Limpar sacola').click({ force: true })  //Tive que forçar o true pois o botão as vezes perdia a referência
      // Verificando a aparição da modal de confirmação
      cy.get('.nex-confirm-modal__content')
        .should('be.visible')
      // Clicando no botão de confirmação da modal
      cy.get('.nex-confirm-modal__footer__confirm').click()
      // Verificando se a sacola está vazia
      cy.get('.cart-container > p').should('have.text', 'Sua sacola está vazia.')
    });
  })
})


