
/* cart is an array of objects contains all selected items  */
var cart = new Array();
var totalItems = 0;
var totalCost = 0;

window.onload = () => {
    loadLocations(); // to load the all locations in selectbox
    loadItems();  // to draw all the items 
}



// loadData function is fetching data from json 
const loadData = (data, callBack) => {
    url = data+".json";

    fetch(url).then((response) => {

        if (response.status != 200) {
            console.warn("There is some problem on loading " + data +
                response.status);
            return;
        };

        response.json().then((data) => {
            callBack(data);
        });

    }).catch(function (err) {
        console.error('Fetch Error -', err);
    });
}

/* This method add locations in select box */
const drawLocations = (data) => {
    let dropdown = document.getElementById("location");
    dropdown.length = 0;
    let defaultValue = document.createElement("option");
    defaultValue.text = "ChooseLocation";
    dropdown.appendChild(defaultValue);

    data.forEach((item) => {
        let option = document.createElement("option");
        option.text = item;
        option.value = item;
        dropdown.add(option);

    });



};

/* this function is to draw item list  */
/* data -> Items list  */

const drawItemList = (data) => {
    data.forEach((article) => {

        let option = document.getElementById("items");
        let element = document.createElement("input");
        element.type = "checkbox";
        element.id = article.id;
        let capt = document.createElement("label");
        capt.htmlFor = article.id;
        capt.innerHTML = article.Name;
        let container = document.createElement("div");
        container.id = "div" + article.id;
        container.appendChild(element);
        container.appendChild(capt);
        element.setAttribute("DataId", article.id);
        element.setAttribute("DataName", article.Name);
        element.setAttribute("DataPrice", article.Price);
        option.appendChild(container)
        element.addEventListener('change', function (event) {

            let id = this.getAttribute("DataId");
            let Name = this.getAttribute("DataName");
            let Price = this.getAttribute("DataPrice");
            if (this.checked == true) {

                cart.push(createEntry(id, Name, Price));
                displayCart(id);
            }
            else if (this.checked == false) {
                removeFromCart(id);

            }

        });
        ;

    });

}

/* To create the entry of selected article  */
const createEntry = (ItemId, ItemName, ItemPrice) => {
    let article = {
        id: ItemId,
        Name: ItemName,
        Price: ItemPrice,
        quantity: 0

    };
    return article;
}

/* to remove the article from the cart  */
const removeFromCart = (id) => {

    /* removing element from DOM  */
    let target = document.getElementById("art" + id);
    target.remove();
    /* removing Element from cart array  */

    cart.forEach((item) => {
        if (item.id == id) {
          item.quantity = 0;

            cart.splice(cart.indexOf(item), 1);
            return;
        }

    });
    showDetails();

}

/* function to  Display cart */
const displayCart = (id) => {
    cart.forEach((items) => {
        if (items.id == id) {
            let target = document.getElementById("Mycart");
            let container = document.createElement("div");
            container.id = "art" + items.id;
            let tagline = document.createTextNode(items.Name)
            let unit = document.createTextNode(`unit price ${items.Price}`);
            let num = document.createElement("input");
            num.type = "number";
            num.min = 0;
            num.default = items.quantity;
            num.placeholder = items.quantity;
            num.id = "num" + items.id;
            num.addEventListener('keyup', function (event) {
                items.quantity = this.value;
                showDetails();

            });
            num.addEventListener('change', function (event) {
                items.quantity = this.value;
                showDetails();

            });

            container.appendChild(num);
            container.appendChild(tagline);
            container.appendChild(document.createElement("br"));
            container.appendChild(unit);
            target.appendChild(container);
        }

    })
};



/* to filter Contents in article list */
const filter = () => {
    let search = document.getElementById("productSearch").value;
    let items = document.getElementById("items").children;
    for (let item of items) {
        let itemName = item.getElementsByTagName("label")[0].innerText;
        if (itemName.toUpperCase().indexOf(search.toUpperCase()) == -1) {
            item.style.display = "none";
        } else {
            item.style.display = "block";
        }

    };


};
const showDetails = () => {
    totalItems = 0 ;
    totalCost = 0 ;
    cart.forEach((item) => {

        totalItems += Number(item.quantity) ;

        totalCost += Number(item.quantity) * Number(item.Price);
      
        
    });
    let target = document.getElementById("totalItems");
    target.innerHTML = `totalItems : ${totalItems}`;
    let costTarget = document.getElementById("totalPrice");
    costTarget.innerHTML = `Total Cost : ${totalCost}`

}



const loadLocations = () => {
    /* calling loadData function and passing
    drawLocation function as parameter */
    loadData("locations", drawLocations);
}
const loadItems = () => {
    /* calling loadData function and passing
   drawItemList function as parameter */
    loadData("items", drawItemList);
}

const createJsonFile = ()=>{
    let finalData = [] ;
    cart.forEach( (item)=>{
        finalData.push( JSON.stringify(item) ) ;
    } ) ;
    
   
 document.write(
     
    
     "Date : " + cart[0].Date+ "</br>"+
     "Time : " + cart[0].Time+"</br>"+
     "Location :"+cart[0].Location+"</br>"+
     "Total Items :"+cart[0].TotalItems+"</br>"+
     "Total cost : "+cart[0].TotalPrice+"</br>"

 ) ;
 

 
}

const handleSubmit = (event) => {
    if (cart.length == 0) {
        window.alert("Cart is empty");
        return;
    }
    else {

        const time = document.getElementById("timing").value;
        const date = document.getElementById("date").value;
        const location = document.getElementById("location").value;
        let obj = {
            Location: location,
            Time: time,
            Date: date,
            TotalPrice: totalCost,
            TotalItems: totalItems,


        }
        cart.unshift(obj);
        createJsonFile();

    }

}