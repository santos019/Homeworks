let output = localStorage.getItem('list')
let loadingArr = JSON.parse(output)
const registerBtn = document.querySelector('.btnContext')
const totalList = document.querySelector('.ContentsListContainer')
const removeBtn = document.querySelector('.clearContext')
// const listOBJ = [

// ]
if (loadingArr === null) loadingArr = []

let countNumber = loadingArr.length === 0 ? 0 : loadingArr[loadingArr.length - 1].nodeId + 1

if (localStorage.getItem('list') !== null) {
    for (const i in loadingArr) {
        const Inserttext = document.createTextNode(loadingArr[i].nodeValue)
        const newList = paintList(Inserttext, i)
        newList.id = loadingArr[i].nodeId
    }
}
function paintList (input, i) {
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
    newList.style.float = 'left'
    newList.style.width = '100%'
    newList.style.height = '25px'
    newList.style.marginLeft = '4%'
    newList.style.marginTop = '0.2%'

    totalList.appendChild(newList)
    liContextDiv.className = 'liContextDiv'
    removeBtnDiv.className = 'removeBtnDiv'
    chkBox.className = 'checkDiv'
    chkLabel.className = 'checkLabel FalseBox'
    chkLabel.for = 'check' + countNumber
    // newList.id = countNumber++ ++꼭해
    // loadingArr.push({ nodeId: countNumber++, nodeValue: input.data, nodeCheck: false })
    console.log(loadingArr)
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
    if (event.target.className === 'removeBtnDiv') {
        output = localStorage.getItem('list')
        loadingArr = JSON.parse(output)
        const upNode = event.target.parentNode
        const moreUpNode = upNode.parentNode
        const deleteIndex = event.target.parentNode.id
        console.log(deleteIndex)
        if (localStorage.getItem('list').length <= 1) {
            localStorage.clear()
            loadingArr = []
        } else {
            // loadingArr.splice(deleteIndex, 1)
            // console.log(deleteIndex)
            // console.log('지운배열' + loadingArr)
            moreUpNode.removeChild(upNode)
            // for (let k in loadingArr) {
            //     if (loadingArr[k].nodeId === deleteIndex) {
            //         loadingArr.splice(k, k)
            //     }
            // }
            const filterArr = loadingArr.filter((el) => Number(el.nodeId) !== Number(deleteIndex))
            console.log(filterArr)
            // const allList = document.getElementsByTagName('li')
            // for (let j = allList.length - 1; j > -1; j--) {
            //     console.log('before' + allList[j].id)
            //     allList[j].id = j
            //     console.log('after' + allList[j].id)
            // }
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
    }
}
removeBtn.addEventListener('click', allRemoveList)
function allRemoveList () {
    const ulList = document.querySelector('.ContentsListContainer')
    const allList = document.getElementsByTagName('li')

    // eslint-disable-next-line no-const-assign
    for (let i = allList.length - 1; i > -1; i--) { ulList.removeChild(allList[i]) }
    localStorage.clear()
}
registerBtn.addEventListener('mouseenter', addBtnHover)
function addBtnHover () {
    registerBtn.classList.replace('btnContext', 'btnContextHover')
}
registerBtn.addEventListener('mouseout', addBtnOver)
function addBtnOver () {
    registerBtn.classList.replace('btnContextHover', 'btnContext')
}
