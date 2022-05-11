let output = localStorage.getItem('list')
let loadingArr = JSON.parse(output)
const registerBtn = document.querySelector('.btnContext')
const totalList = document.querySelector('.ContentsListContainer')
const removeBtn = document.querySelector('.clearContext')

if (loadingArr === null) loadingArr = []

let countNumber = loadingArr.length === 0 ? 0 : loadingArr[loadingArr.length - 1].nodeId + 1

if (localStorage.getItem('list') !== null) {
    for (const i in loadingArr) {
        const Inserttext = document.createTextNode(loadingArr[i].nodeValue)
        const newList = paintList(Inserttext, i)
        newList.id = loadingArr[i].nodeId
        if (loadingArr[i].nodeCheck === true) {
            const setChkBox = document.getElementById('check' + countNumber)
            setChkBox.checked = true
            const changeDiv = newList.childNodes[2]
            const changeChkImg = newList.childNodes[1]
            changeChkImg.classList.replace('FalseBox', 'TrueBox')
            changeDiv.style.textDecoration = 'line-through'
        }
    }
    console.log(loadingArr)
}
function paintList (input) {
    const removeBtnDiv = document.createElement('div')
    const newList = document.createElement('li')
    const liContextDiv = document.createElement('div')
    const chkBox = document.createElement('input')
    chkBox.id = 'check' + countNumber
    chkBox.type = 'checkbox'
    const chkLabel = document.createElement('label')

    liContextDiv.appendChild(input)

    newList.appendChild(chkBox)
    newList.appendChild(chkLabel)
    newList.appendChild(liContextDiv)
    newList.appendChild(removeBtnDiv)
    newList.className = 'newList'

    totalList.appendChild(newList)
    liContextDiv.className = 'liContextDiv' // + countNumber
    removeBtnDiv.className = 'removeBtnDiv'
    chkBox.className = 'checkDiv'
    chkLabel.className = 'checkLabel FalseBox'
    chkLabel.for = 'check' + countNumber
    // console.log(loadingArr)
    return newList
}

// 문제: 길이에 따라서 조정 필요함 순서가 보장된다는 전제하에 마지막 인덱스 값을 넣어준다.->순서보장안됨// 특정 인덱스에 최대 값을 저장한다. => value에 배열로 저장하면 된다.

registerBtn.addEventListener('click', addList)
function addList () {
    const InsertValue = document.querySelector('.btnInsert').value
    const Inserttext = document.createTextNode(InsertValue)
    const newList = paintList(Inserttext)
    newList.id = countNumber
    loadingArr.push({ nodeId: Number(countNumber++), nodeValue: InsertValue, nodeCheck: false })
    localStorage.setItem('list', JSON.stringify(loadingArr))
    const InputValue = document.querySelector('.btnInsert')
    InputValue.value = ''
}

totalList.addEventListener('click', removeList)

function removeList () {
    output = localStorage.getItem('list')
    loadingArr = JSON.parse(output)
    const deleteIndex = event.target.parentNode.id
    if (event.target.className === 'removeBtnDiv') {
        const upNode = event.target.parentNode
        const moreUpNode = upNode.parentNode
        console.log(deleteIndex)
        if (localStorage.getItem('list').length <= 1) {
            localStorage.clear()
            loadingArr = []
        } else {
            moreUpNode.removeChild(upNode)
            const filterArr = loadingArr.filter((el) => Number(el.nodeId) !== Number(deleteIndex))
            console.log(filterArr)
            localStorage.setItem('list', JSON.stringify(filterArr))
        }
    } else if (event.target.className === 'liContextDiv') {
        const labelDiv = event.target.previousSibling
        if (event.target.style.textDecoration === 'line-through') {
            event.target.style.textDecoration = 'none'
            labelDiv.classList.replace('TrueBox', 'FalseBox')
        } else {
            event.target.style.textDecoration = 'line-through'
            labelDiv.classList.replace('FalseBox', 'TrueBox')
        }
        // eslint-disable-next-line prefer-const
        for (let i in loadingArr) {
            console.log(i)
            if (loadingArr[i].nodeId === Number(deleteIndex)) {
                loadingArr[i].nodeCheck = !loadingArr[i].nodeCheck
                console.log('in' + i)
            }
        }
        console.log(loadingArr)
        localStorage.setItem('list', JSON.stringify(loadingArr))
    } else if (event.target.classList.contains('checkLabel')) {
        const textDiv = event.target.nextSibling
        const checkValue = event.target.previousSibling.checked

        if (checkValue === false) {
            // checkValue=true;
            event.target.previousSibling.checked = true
            event.target.classList.replace('FalseBox', 'TrueBox')
            textDiv.style.textDecoration = 'line-through'
        } else {
            // checkValue=false;
            event.target.previousSibling.checked = false
            event.target.classList.replace('TrueBox', 'FalseBox')
            textDiv.style.textDecoration = 'none'
        }
        for (let i in loadingArr) {
            console.log(i)
            if (loadingArr[i].nodeId === Number(deleteIndex)) {
                loadingArr[i].nodeCheck = !loadingArr[i].nodeCheck
                console.log('in' + i)
            }
        }
        console.log(loadingArr)
        localStorage.setItem('list', JSON.stringify(loadingArr))
    }
}
removeBtn.addEventListener('click', allRemoveList)
function allRemoveList () {
    const ulList = document.querySelector('.ContentsListContainer')
    const allList = document.getElementsByTagName('li')

    // eslint-disable-next-line no-const-assign
    for (let i = allList.length - 1; i > -1; i--) { ulList.removeChild(allList[i]) }
    loadingArr = []
    localStorage.clear()
}

removeBtn.addEventListener('mouseenter', removeBtnHover)
function removeBtnHover () {
    removeBtn.classList.replace('clearContext', 'clearContextHover')
}

removeBtn.addEventListener('mouseout', removeBtnOver)
function removeBtnOver () {
    removeBtn.classList.replace('clearContextHover', 'clearContext')
}

registerBtn.addEventListener('mouseenter', addBtnHover)
function addBtnHover () {
    registerBtn.classList.replace('btnContext', 'btnContextHover')
}
registerBtn.addEventListener('mouseout', addBtnOver)
function addBtnOver () {
    registerBtn.classList.replace('btnContextHover', 'btnContext')
}
