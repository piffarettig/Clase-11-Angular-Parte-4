"use strict";
var Pet = (function () {
    function Pet(id, name, age, size, birthDate, weight, breedName, imageUrl, rating) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.size = size;
        this.birthDate = birthDate;
        this.weight = weight;
        this.breedName = breedName;
        this.imageUrl = imageUrl;
        this.rating = rating;
    }
    return Pet;
}());
exports.Pet = Pet;
//# sourceMappingURL=pet.js.map