

exports.findNumberAroundTag = function(sourceText, stringToFind, reverseIndexSearch){

    let tagLocationIndex = sourceText.indexOf(stringToFind.toLowerCase()) > -1 ? sourceText.indexOf(stringToFind.toLowerCase()) : sourceText.indexOf(stringToFind.toUpperCase());

    if (tagLocationIndex == -1) {
        return "Unavailable";
    }

    let isbnValue = '';

    let tagToSearchIndex = reverseIndexSearch ? tagLocationIndex - 50 : tagLocationIndex;
    tagToSearchIndex = tagToSearchIndex < 0 ? 0 : tagToSearchIndex;

    let internalSubstring = sourceText.substr(tagToSearchIndex, 50).trim();

    isbnValue = internalSubstring.replace(/\D+/g, "");

    if (isbnValue.length != 13 && tagLocationIndex == -1) {
        isbnValue = "Unavailable";
    }

    return isbnValue;
}