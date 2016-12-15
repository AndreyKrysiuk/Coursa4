function updateList() {
    // дані
    var myList = [
        { title: 'Title 1' },
        { title: 'Title 2' },
        { title: 'Title 3' }
    ];
    // отримати об'єкт шаблона із DOM за його ідентифікатором "my-list-template" і взяти його HTML вміст
    var template = document.getElementById("my-list-template").innerHTML;
    // згенерувати HTML строку на основі шаблону і даних
    var renderedHTML = Mustache.render(template, { list: myList });
    // помістити строку з HTML всередину елемента з ідентифікатором "my-list"
    document.getElementById("my-list").innerHTML = renderedHTML;
}
