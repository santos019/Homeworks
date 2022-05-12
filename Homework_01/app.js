let output = localStorage.getItem('list')
let loadingArr = JSON.parse(output) === null ? [] : JSON.parse(output)
let countNumber = loadingArr.length === 0 ? 0 : loadingArr[loadingArr.length - 1].nodeId + 1

const registerBtn = document.querySelector('.btnContext')
const totalList = document.querySelector('.ContentsListContainer')
const removeBtn = document.querySelector('.clearContext')
const someRmBtn = document.querySelector('.cleanChecked')
const writeBtn = document.querySelector('.moreFooterContainer')
const writeDiv = document.querySelector('.writeContext')
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
totalList.addEventListener('mouseover', hoverEvnt)
totalList.addEventListener('mouseout', hoverEvnt)
function hoverEvnt (event) {
    if (event.target.classList.contains('checkLabel') || event.target.classList.contains('liContextDiv') || event.target.classList.contains('removeBtnDiv')) {
        const evntArr = event.target.className.split(' ')
        event.target.classList.toggle(evntArr[0] + 'hvEvnt')
    }
}
function listEvnt (event) { // 지우기 버튼과 체크, 라벨 버튼 클릭 이벤트
    output = localStorage.getItem('list')
    loadingArr = JSON.parse(output)
    const parNode = event.target.parentNode
    const deleteIndex = parNode.id
    if (event.target.classList.contains('removeBtnDiv')) {
        const moreUpNode = parNode.parentNode
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
    } else if (event.target.classList.contains('writeDiv')) {
        // document.addEventListener('click', closeModal) 전체닫는거
        const titleParent = document.querySelector('.writeTitle')
        const contextParent = document.querySelector('.writeContext')
        console.log(titleParent.firstChild)
        if (titleParent.firstChild !== null) titleParent.removeChild(titleParent.firstChild)
        if (contextParent.firstChild !== null) contextParent.removeChild(contextParent.firstChild)
        writeBtn.classList.add('moreFooterContainerOpen')
        const ans = loadingArr.find(e => Number(e.nodeId) === Number(deleteIndex))
        const Inserttext = document.createTextNode(ans.nodeValue)
        const InsertContext = document.createTextNode(ans.context)
        titleParent.appendChild(Inserttext)
        contextParent.appendChild(InsertContext)
        writeDiv.addEventListener('click', writeEvnt)
    }
    localStorage.setItem('list', JSON.stringify(loadingArr))
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
someRmBtn.addEventListener('mouseenter', someRmBtnChange)
someRmBtn.addEventListener('mouseleave', someRmBtnChange)
function someRmBtnChange () {
    someRmBtn.classList.toggle('cleanCheckedtHover')
}
window.addEventListener('keyup', e => addList(e))
// writeDiv.addEventListener('click', writeSome)
// function writeSome () {
//     const textDiv = document.createElement('textarea') // 노드 있는거 지우고 텍스트에리어 오게 외부 클릭하면 그대로 저장되게...
// }
// textarea가 활성화 되어 있을 때는 textarea만 닫고, textarea가 활성화 되어 있지 않을 때는 모달창을 닫는다.
function closeModal () { // 전체닫는거
    if (!event.target.classList.contains('writeContext')) {
        console.log(event.target)
    }
}

function writeEvnt () { // 텍스트area로 넘어가는 이벤트
    // event.target.classList.add('writeContextClose')
    console.log(this.nextSibling.nextSibling)
    this.classList.add('writeContextClose')
    this.nextSibling.nextSibling.classList.add('writingOpen')
    window.addEventListener('click', writeClose)
    writeDiv.removeEventListener('click', writeEvnt)
}
function writeClose () { // 본문으로 넘어가는 이벤트
    const textDiv = document.getElementsByTagName('textarea')
    console.log(event.target)
    if (event.target.className !== 'writing' && !event.target.classList.contains(writeDiv)) {
        // console.log(writeDiv.nextSibling)
        // writeDiv.nextSibling.classList.remove('writingOpen')
        window.removeEventListener('click', writeClose)
        writeDiv.addEventListener('click', writeEvnt)
    }
}
