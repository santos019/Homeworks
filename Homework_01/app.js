let output = localStorage.getItem('list')
let loadingArr = JSON.parse(output) === null ? [] : JSON.parse(output)
let countNumber = loadingArr.length === 0 ? 0 : loadingArr[loadingArr.length - 1].nodeId + 1

const registerBtn = document.querySelector('.btnContext')
const totalList = document.querySelector('.ContentsListContainer')
const removeBtn = document.querySelector('.clearContext')
const someRmBtn = document.querySelector('.cleanChecked')
const writeBtn = document.querySelector('.moreFooterContainer')
const writeDiv = document.querySelector('.writeContext')
const textDiv = document.querySelector('.writing')
const writeTitle = document.querySelector('.writeTitle')
let currentIndex = -1
if (localStorage.getItem('list') !== null) {
    for (const i in loadingArr) {
        const Inserttext = document.createTextNode(loadingArr[i].nodeValue)
        const newList = paintList(Inserttext)
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
}
someRmBtn.addEventListener('click', chkRemove)
function chkRemove () { // 체크된 것만 지우는 함수
    output = localStorage.getItem('list')
    loadingArr = JSON.parse(output) === null ? [] : JSON.parse(output)
    loadingArr = loadingArr.filter(detailCheck)
    localStorage.setItem('list', JSON.stringify(loadingArr))
    allExit()
}
function detailCheck (el) { // chkRemove 함수의 filter callback 함수
    if (el.nodeCheck === true) {
        const removeLi = document.getElementById(el.nodeId)
        totalList.removeChild(removeLi)
        return false
    } else return true
}
function paintList (input) { // 노드를 추가하거나 새로고침할 때 그리는 함수
    const removeBtnDiv = document.createElement('div')
    const newList = document.createElement('li')
    const liContextDiv = document.createElement('div')
    const checkDiv = document.createElement('input')
    const checkLabel = document.createElement('label')
    const writeDiv = document.createElement('div')
    writeDiv.id = 'writeDiv' + countNumber
    writeDiv.className = 'writeDiv'
    liContextDiv.appendChild(input)

    newList.appendChild(checkDiv)
    newList.appendChild(checkLabel)
    newList.appendChild(liContextDiv)
    newList.appendChild(writeDiv)
    newList.appendChild(removeBtnDiv)

    totalList.appendChild(newList)
    checkDiv.id = 'check' + countNumber
    checkDiv.type = 'checkbox'
    newList.className = 'newList'
    liContextDiv.className = 'liContextDiv'
    removeBtnDiv.className = 'removeBtnDiv'
    removeBtnDiv.id = 'removeBtnDiv' + countNumber
    checkDiv.className = 'checkDiv'
    checkLabel.className = 'checkLabel'
    checkLabel.for = 'check' + countNumber
    return newList
}

// 문제: 길이에 따라서 조정 필요함 순서가 보장된다는 전제하에 마지막 인덱스 값을 넣어준다.->순서보장안됨// 특정 인덱스에 최대 값을 저장한다. => value에 배열로 저장하면 된다.

registerBtn.addEventListener('click', addList)
function addList (e) { // 리스트를 새로 추가하는 함수
    if ((e.type === 'keyup') && (e.key !== 'Enter')) { return }

    const InsertValue = document.querySelector('.btnInsert').value
    const Inserttext = document.createTextNode(InsertValue)
    const newList = paintList(Inserttext)
    newList.id = countNumber
    loadingArr.push({ nodeId: Number(countNumber++), nodeValue: InsertValue, nodeCheck: false, context: '' })
    localStorage.setItem('list', JSON.stringify(loadingArr))
    const InputValue = document.querySelector('.btnInsert')
    InputValue.value = ''
}

totalList.addEventListener('click', listEvnt)
// totalList.addEventListener('mouseover', hoverEvnt)
// totalList.addEventListener('mouseout', hoverEvnt)
// function hoverEvnt (event) {
//     if (event.target.classList.contains('checkLabel') || event.target.classList.contains('liContextDiv') || event.target.classList.contains('removeBtnDiv') || event.target.classList.contains('writeDiv')) {
//         const evntArr = event.target.className.split(' ')
//         event.target.classList.toggle(evntArr[0] + 'hvEvnt')
//     }
// }
function listEvnt (event) { // 지우기 버튼과 체크, 라벨 버튼 클릭 이벤트
    output = localStorage.getItem('list')
    loadingArr = JSON.parse(output)
    const parNode = event.target.parentNode
    const deleteIndex = parNode.id
    if (event.target.classList.contains('removeBtnDiv')) {
        const moreUpNode = parNode.parentNode
        if (currentIndex !== -1 && (Number(loadingArr[currentIndex].nodeId) === Number(deleteIndex))) {
            allExit()
        }
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
        const ans = loadingArr.find(e => Number(e.nodeId) === Number(deleteIndex))
        ans.nodeCheck = (ans !== undefined ? !ans.nodeCheck : ans.nodeCheck)
    } else if (event.target.classList.contains('writeDiv')) { // 모달 키는거
        if (writeDiv.classList.contains('writeContextClose')) { writeDiv.classList.remove('writeContextClose') }
        if (textDiv.classList.contains('writingOpen')) { textDiv.classList.remove('writingOpen') }
        writeBtn.classList.add('moreFooterContainerOpen')
        currentIndex = loadingArr.findIndex(e => Number(e.nodeId) === Number(deleteIndex))
        painting(currentIndex)
        const exitBtn = document.querySelector('.moreFooterExit')
        exitBtn.addEventListener('click', allExit)
        exitBtn.addEventListener('mouseenter', exitHoverEvnt)
        exitBtn.addEventListener('mouseleave', exitHoverEvnt)
    }
    localStorage.setItem('list', JSON.stringify(loadingArr))
}
function exitHoverEvnt () {
    const exitBtn = document.querySelector('.moreFooterExit')
    exitBtn.classList.toggle('moreFooterExitHover')
}
function painting (Index) { // 제목과 내용을 그리는 함수
    output = localStorage.getItem('list')
    loadingArr = JSON.parse(output)
    if (writeDiv.firstChild !== null) writeDiv.removeChild(writeDiv.firstChild)
    if (writeTitle.firstChild !== null) writeTitle.removeChild(writeTitle.firstChild)

    const Inserttext = document.createTextNode(loadingArr[Index].nodeValue) // text 노드를 교체..???
    const InsertContext = document.createTextNode(loadingArr[Index].context)
    const InserttextP = document.createElement('p')
    const InsertContextP = document.createElement('p')
    // InserttextP.className = 'titleContainer'
    InserttextP.appendChild(Inserttext)
    InsertContextP.appendChild(InsertContext)
    writeTitle.appendChild(InserttextP)
    writeDiv.appendChild(InsertContextP)
    InsertContextP.className = 'listContext'
    writeDiv.addEventListener('click', toWrite)
    textDiv.value = loadingArr[Index].context
}

function toWrite () {
    console.log(event.target)
    if (event.target.classList.contains('writeContext') || event.target.className === 'listContext') {
        writeDiv.classList.toggle('writeContextClose')
        textDiv.classList.toggle('writingOpen')
        window.addEventListener('click', textEvnt)
    }
}

function textEvnt () { // 목록 진입 이벤트
    if (!event.target.classList.contains('writing') && !event.target.classList.contains('writeContext') && !(event.target.className === 'writeDiv')) {
        writeDiv.classList.toggle('writeContextClose')
        textDiv.classList.toggle('writingOpen')
        window.removeEventListener('click', textEvnt)
        loadingArr[currentIndex].context = textDiv.value
        localStorage.setItem('list', JSON.stringify(loadingArr))
        painting(currentIndex)
    }
}

function allExit () {
    if (writeBtn.classList.contains('moreFooterContainerOpen')) {
        writeBtn.classList.remove('moreFooterContainerOpen')
    }
    writeDiv.removeEventListener('click', toWrite)
    if (writeDiv.classList.contains('writeContextClose')) { writeDiv.classList.remove('writeContextClose') }
    if (textDiv.classList.contains('writingOpen')) { textDiv.classList.remove('writingOpen') }
    window.removeEventListener('click', textEvnt)
    event.target.removeEventListener('click', allExit)
}
removeBtn.addEventListener('click', allRemoveList)
function allRemoveList () {
    const ulList = document.querySelector('.ContentsListContainer')
    const allList = document.getElementsByTagName('li')
    allExit()
    // eslint-disable-next-line no-const-assign
    for (let i = allList.length - 1; i > -1; i--) { ulList.removeChild(allList[i]) }
    loadingArr = []
    localStorage.clear()
}

// removeBtn.addEventListener('mouseenter', removeBtnChange)
// removeBtn.addEventListener('mouseleave', removeBtnChange)
// function removeBtnChange () {
//     removeBtn.classList.toggle('clearContextHover')
// }
// registerBtn.addEventListener('mouseenter', addBtnChange)
// registerBtn.addEventListener('mouseleave', addBtnChange)
// function addBtnChange () {
//     registerBtn.classList.toggle('btnContextChange')
// }
// someRmBtn.addEventListener('mouseenter', someRmBtnChange)
// someRmBtn.addEventListener('mouseleave', someRmBtnChange)
// function someRmBtnChange () {
//     someRmBtn.classList.toggle('cleanCheckedtHover')
// }
window.addEventListener('keyup', e => addList(e))
