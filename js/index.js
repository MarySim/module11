// Элементы в DOM
const fruitsList = document.querySelector('.fruits__list');
const shuffleButton = document.querySelector('.shuffle__btn');
const filterButton = document.querySelector('.filter__btn');
const sortKindLabel = document.querySelector('.sort__kind');
const sortTimeLabel = document.querySelector('.sort__time');
const sortChangeButton = document.querySelector('.sort__change__btn');
const sortActionButton = document.querySelector('.sort__action__btn');
const kindInput = document.querySelector('.kind__input');
const colorInput = document.querySelector('.color__input');
const weightInput = document.querySelector('.weight__input');
const addActionButton = document.querySelector('.add__action__btn');
const minWeightInput = document.querySelector('.minweight__input');
const maxWeightInput = document.querySelector('.maxweight__input');

const initialFruits = [
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
];

let fruits = [...initialFruits];

const colorClassMap = {
    "фиолетовый": "fruit_violet",
    "зеленый": "fruit_green",
    "розово-красный": "fruit_carmazin",
    "желтый": "fruit_yellow",
    "светло-коричневый": "fruit_lightbrown",
    "синий": "fruit_blue",
    "оранжевый": "fruit_orange",
    "красный": "fruit_red",
    "голубой": "fruit_cyan",
    "черный": "fruit_black",
    "белый": "fruit_white",
    "розовый": "fruit_pink"
};

// Функция отрисовки списка
const display = () => {
  fruitsList.innerHTML = '';
  for (let i = 0; i < fruits.length; i++) {
    const li = document.createElement('li');
    const colorClass = colorClassMap[fruits[i].color] || 'fruit_violet';
    li.className = `fruit__item ${colorClass}`;
    li.innerHTML = `
      <div class="fruit__info">
        <div>index: ${i}</div>
        <div>kind: ${fruits[i].kind}</div>
        <div>color: ${fruits[i].color}</div>
        <div>weight (кг): ${fruits[i].weight}</div>
      </div>
    `;
    fruitsList.appendChild(li);
  }
};

display();

const shuffleFruits = () => {
  const result = [];
  // Создаем копию, чтобы не менять оригинальный массив во время перемешивания
  let arrForShuffle = [...fruits];
  
  while (arrForShuffle.length > 0) {
    const index = Math.floor(Math.random() * arrForShuffle.length);
    result.push(arrForShuffle.splice(index, 1)[0]);
  }

  const isChanged = fruits.some((item, index) => item !== result[index]);
  
  if (!isChanged) {
    alert('Порядок не изменился!');
  }
  
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

filterButton.addEventListener('click', () => {
  const min = parseInt(minWeightInput.value) || 0;
  const max = parseInt(maxWeightInput.value) || Infinity;
  
  // Берем данные из начального массива, чтобы фильтрация работала всегда корректно
  fruits = initialFruits.filter(item => item.weight >= min && item.weight <= max);
  display();
});

let sortKind = 'bubbleSort';
let sortTime = '-';

const priority = ['розово-красный', 'зеленый', 'желтый', 'светло-коричневый', 'фиолетовый'];

const comparationColor = (a, b) => {
  const priorityA = priority.indexOf(a.color);
  const priorityB = priority.indexOf(b.color);
  
  // Если цвета нет в приоритете, считаем его "меньшим" (или можно отправить в конец)
  return priorityA > priorityB;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  },
  
  quickSort(arr, comparation) {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(item => comparation(pivot, item));
    const mid = arr.filter(item => item.color === pivot.color);
    const right = arr.filter(item => comparation(item, pivot));
    return [...this.quickSort(left, comparation), ...mid, ...this.quickSort(right, comparation)];
  },

  startSort(sortType, arr, comparation) {
    const start = new Date().getTime();
    
    if (sortType === 'bubbleSort') {
        this.bubbleSort(arr, comparation);
    } else {
        fruits = this.quickSort(arr, comparation);
    }
    
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  // Небольшая задержка, чтобы пользователь увидел надпись
  setTimeout(() => {
    sortAPI.startSort(sortKind, fruits, comparationColor);
    display();
    sortTimeLabel.textContent = sortTime;
  }, 10); 
});

addActionButton.addEventListener('click', () => {
  if (!kindInput.value || !colorInput.value || !weightInput.value) {
    alert('Заполните все поля!');
    return;
  }
  
  const newFruit = { 
      kind: kindInput.value, 
      color: colorInput.value, 
      weight: parseInt(weightInput.value) 
  };
  
  initialFruits.push(newFruit);
  fruits = [...initialFruits];
  display();
});