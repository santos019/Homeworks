let output = localStorage.getItem('list')
let loadingArr = JSON.parse(output) === null ? [] : JSON.parse(output)
let countNumber = loadingArr.length === 0 ? 0 : loadingArr[loadingArr.length - 1].nodeId + 1

const registerBtn = document.querySelector('.btnContext')
const totalList = document.querySelector('.ContentsListContainer')
const removeBtn = document.querySelector('.clearContext')
const keyInput = document.querySelector('.btnInsert')

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
            changeChkImg.classList.toggle('TrueBox')
            changeDiv.style.textDecoration = 'line-through'
        }
    }
    // console.log(loadingArr)
}
function paintList (input) {
    const removeBtnDiv = document.createElement('div')
    const newList = document.createElement('li')
    const liContextDiv = document.createElement('div')
    const checkDiv = document.createElement('input')
    const checkLabel = document.createElement('label')

    liContextDiv.appendChild(input)

    newList.appendChild(checkDiv)
    newList.appendChild(checkLabel)
    newList.appendChild(liContextDiv)
    newList.appendChild(removeBtnDiv)

    totalList.appendChild(newList)
    checkDiv.id = 'check' + countNumber
    checkDiv.type = 'checkbox'
    newList.className = 'newList'
    liContextDiv.className = 'liContextDiv'
    removeBtnDiv.className = 'removeBtnDiv'
    checkDiv.className = 'checkDiv'
    checkLabel.className = 'checkLabel'
    checkLabel.for = 'check' + countNumber
    return newList
}

// 문제: 길이에 따라서 조정 필요함 순서가 보장된다는 전제하에 마지막 인덱스 값을 넣어준다.->순서보장안됨// 특정 인덱스에 최대 값을 저장한다. => value에 배열로 저장하면 된다.

registerBtn.addEventListener('click', addList)
function addList (e) {
    if ((e.type === 'keyup') && (e.key !== 'Enter')) { return }

    const InsertValue = document.querySelector('.btnInsert').value
    const Inserttext = document.createTextNode(InsertValue)
    const newList = paintList(Inserttext)
    newList.id = countNumber
    loadingArr.push({ nodeId: Number(countNumber++), nodeValue: InsertValue, nodeCheck: false })
    localStorage.setItem('list', JSON.stringify(loadingArr))
    const InputValue = document.querySelector('.btnInsert')
    InputValue.value = ''
}

[].map(function (value, index, array) {
    return {
        value: value + '1'
    }
})

totalList.addEventListener('click', removeList)
totalList.addEventListener('mouseover', hoverEvnt)
totalList.addEventListener('mouseout', hoverEvnt)
function hoverEvnt () {
    if (event.target.classList.contains('checkLabel') || event.target.classList.contains('liContextDiv') || event.target.classList.contains('removeBtnDiv')) {
        const evntArr = event.target.className.split(' ')
        event.target.classList.toggle(evntArr[0] + 'hvEvnt')
    }
}
function removeList (event) {
    output = localStorage.getItem('list')
    loadingArr = JSON.parse(output)
    const parNode = event.target.parentNode
    const deleteIndex = parNode.id
    if (event.target.classList.contains('removeBtnDiv')) {
        const moreUpNode = parNode.parentNode
        // console.log(deleteIndex)
        if (localStorage.getItem('list').length <= 1) {
            localStorage.clear()
            loadingArr = []
            return
        } else {
            moreUpNode.removeChild(parNode)
            loadingArr = loadingArr.filter((el) => Number(el.nodeId) !== Number(deleteIndex))
        }
    } else if (event.target.classList.contains('liContextDiv') || event.target.classList.contains('checkLabel')) {
        const checkDiv = parNode.childNodes[0]
        const labelDiv = parNode.childNodes[1]
        const listDiv = parNode.childNodes[2]
        checkDiv.checked = !checkDiv.checked
        labelDiv.classList.toggle('TrueBox')
        listDiv.style.textDecoration = listDiv.style.textDecoration === 'line-through' ? 'none' : 'line-through'
        // 이거 먼저 만들어진  find나 findindex 사용하는게 더 빠른지????
        // eslint-disable-next-line prefer-const
        for (let i in loadingArr) {
            if (loadingArr[i].nodeId === Number(deleteIndex)) {
                loadingArr[i].nodeCheck = !loadingArr[i].nodeCheck
            }
        }
    }
    localStorage.setItem('list', JSON.stringify(loadingArr))
}
removeBtn.addEventListener('click', allRemoveList)
function allRemoveList (
    
) {
    const ulList = document.querySelector('.ContentsListContainer')
    const allList = document.getElementsByTagName('li')

    // eslint-disable-next-line no-const-assign
    for (let i = allList.length - 1; i > -1; i--) { ulList.removeChild(allList[i]) }
    loadingArr = []
    localStorage.clear()
}

removeBtn.addEventListener('mouseenter', removeBtnChange)
removeBtn.addEventListener('mouseleave', removeBtnChange)
function removeBtnChange () {
    removeBtn.classList.toggle('clearContextHover')
}
registerBtn.addEventListener('mouseenter', addBtnChange)
registerBtn.addEventListener('mouseleave', addBtnChange)
function addBtnChange () {
    registerBtn.classList.toggle('btnContextChange')
}
keyInput.addEventListener('keyup', e => addList(e))
