window.onload = function(){
    var aData = [
        {
            ID:2,
            name:'haylee',
            age: 20,
            sexual:'保密',
        },
        {
            ID:1,
            name:'lucia',
            age: 2,
            sexual:'女',
        },
        {
            ID:8,
            name:'Nathan',
            age: 22,
            sexual:'男',
        },
        {
            ID:3,
            name:'mark',
            age: 25,
            sexual:'男',
        },
        {
            ID:4,
            name:'Niocle',
            age: 40,
            sexual:'女',
        },
        {
            ID:5,
            name:'George',
            age: 24,
            sexual:'男',
        }
    ];

    var table = document.querySelector('#tab');
    var tbody = document.querySelector('tbody');

    
    //默认全选按钮是未选中状态
    var state = false;

    //定义一个变量 放随机整数
    var n = null;

    //新数据的年龄
    var m = null;

    //放选中的表格单选框
    var count = 0;

    //排序方法 默认识未排序的值是0，升序是1，降序是2
    var sortmethod = 0;

    //渲染表格 method--是要升序还是降序 还是不用排序 
    //默认识未排序的值是0，升序是1，降序是2
    function render(aData,method){
        //改变数组的顺序之后再进行渲染
        if(method===0){//无序
            
        }else if(method===1){//生序
            aData.sort(function(a,b){
                return a.age - b.age
             })
        }else if(method===2){
            aData.sort(function(a,b){//降序
                return b.age - a.age
             })
        }

        tbody.innerHTML = ''
        for(var i = 0; i < aData.length; i++){
            if(aData[i].ID!=null){
                tbody.innerHTML += `
                <tr>
                    <td>
                        <input type="checkbox"/>
                    </td>
                    <td class="ID">${aData[i].ID}</td>
                    <td>${aData[i].name}</td>
                    <td>${aData[i].age}</td>
                    <td>${aData[i].sexual}</td>
                    <td>
                        <a href="javascript:;">删除</a>
                    </td>
                </tr>
                `
            }
    
        }
    }
    render(aData,sortmethod)

    //表格里面的删除按钮
    var dels = tbody.getElementsByTagName('a');
    
    var tr = tbody.getElementsByTagName('tr');
    
    //单行删除
    //把dels的点击删除tr的事件委托给tbody
    tbody.addEventListener('click',function(ev){
        //表格主体里面的单选框
        var inpRow = tbody.getElementsByTagName('input');
        //被点击删除的行 之后显示的信息行的数量
        var DeleteRowNum = inpRow.length;

       //如果ev.target就是触发事件的元素【被点击的删除行按钮】
        if(ev.target.nodeName==='A'){
            //点击删除按钮 删除所在行的父级tr 
            var tr = ev.target.parentNode.parentNode
            tr.remove();

            DeleteRowNum--;
            //点击删除按钮 所在行的显示ID的标签
            var innerId = ev.target.parentNode.parentNode.children[1];
            //拿出被选中行的ID里面的数字
            var findId = Number(innerId.innerHTML)
            
            //点击删除按钮 所在行的单选框
            var checkbox = ev.target.parentNode.parentNode.children[0].firstElementChild
            
            
            if(checkbox.checked===true){//如果被删除行的单选框再删除的时候是选中的
                //被选中数量要自减一
                count--;
                //传入被点击的删除行的单选框 和 剩余在表格主体的信息行的数量 判断全选是否选中
                isSelectAll(checkbox,DeleteRowNum)
            }else{//如果被删除行的单选框再删除的时候是没有选中的 count数量没有变化
                //传入被点击的删除行的单选框 和 剩余在表格主体的信息行的数量 判断全选是否选中
                isSelectAll(checkbox,DeleteRowNum)
            }
            //如果被选中要删除的项的ID内容能在数组中找到，就把找到的那一项的ID属性值设置未null
            for(var j = 0; j< aData.length;j++){
                if(aData[j].ID===findId){////单行删除之后改变数组，给被删除的数据做一个标记，之后渲染生成结构的时候跳过不渲染
                    aData[j].ID =null;
                }
            }
            
        }
    })


    //表头全选按钮
    var selectAll = document.querySelector('#selectAll');
    // //表格主体里面的单选框
    var inpRow = tbody.getElementsByTagName('input');

    //每行的单选按钮点击事件
    clickSelectAll(inpRow)

    //删除选中按钮
    var delectAll = document.querySelector('#delectAll')
    //年龄排序按钮
    var ageSort = document.querySelector('#ageSort')
    

    //按照年龄排序的方式
    ageSort.onclick = function(){
        //如果原本没有排序或者是降序，点击变为升序
        if(sortmethod==0||sortmethod==2){
             sortmethod = 1; 
             ageSort.value = '年龄从大到小'
        }else{
            //如果原本是升序，点击变为降序
             sortmethod=2;
             ageSort.value = '年龄从小到大'
        }

        //数组按照想要的排序之后重新进行渲染
        render(aData,sortmethod)

        //重新渲染更改结构之后，要取消全选
        selectAll.checked =  false;
        state = false;
        var inpRow = tbody.getElementsByTagName('input');
        //每行的单选按钮点击事件
        clickSelectAll(inpRow)
    }
    

    //添加按钮
    var add = document.querySelector('#add');
    var userName = document.querySelector('#userName');
    var age = document.querySelector('#age');
    var sex = document.querySelector('#sex');

    
    /*
    数组添加时候的排序：
        如果有年龄相同的：
            放在相同年龄的后面
        如果没有相同年龄的：
            升序的话
                新的数组的年龄>旧的数组年龄  --->放在旧的数组后面
                反之 放在旧的数组前面
            降序
                新的数组的年龄>旧的数组年龄  --->放在旧的数组前面
                反之 放在旧的数组后面
    */     

   //点击添加按钮的时候   向数组中添加对象，然后在表格中渲染出来
    add.onclick = function(){
        /*字符串.trim()消除输入的时候的空格
        用户名只能非数字的字符串 
        输入的年龄只能是数字
        */
       if(userName.value.trim()===''||age.value.trim()===''){//如果没有输入内容
           alert('完整的信息才能添加哦')
           return;
       }else{//输入有内容
        
            if(String(Number(userName.value.trim()))==='NaN'){
                //表示输入的内容不是数字类型的字符串
            }else{//如果输入的是数字
                alert('请输入正确的姓名哦~');
                userName.value = '';
                return;
            }
            
            //String(Number(age.value.trim()))==='number' 输入的是数字类型的字符串
            if(String(Number(age.value.trim()))==='NaN'){//如果输入的不是数字
                alert('请输入正确的年龄哦~')
                age.value = '';
                return;
            }
            
       }
       
        //n为一个随机整数
        n = parseInt(Math.random()*1000)

        //数组中的对象的ID属性值是唯一的，如果点击时生成的随机数和之前的有相同的话，就不能添加成功
        for(var i = 0; i < aData.length; i++){
            if(n===aData[i].ID){
                return
            }
        }

        //声明一个对象，把复合条件的输入内容放到对象中
        var obj = {
            ID: n,
            name:userName.value,
            age: age.value,
            sexual: sex.value,

        }
        //把对象放到数组中
        aData.push(obj)
        //用新的数组去重新渲染
        render(aData,sortmethod)
        //重新渲染的时候全选框是未选中状态
        selectAll.checked =  false; 
        
        // 数组更改结构重新渲染了 要重新获取
        var inpRow = tbody.getElementsByTagName('input');

        // 每行的单选按钮点击事件
        clickSelectAll(inpRow)

        userName.value = '';
        age.value ='';
    } 
    
    //表格主体显示ID的标签
   var innerId = document.getElementsByClassName('ID');
   
    //删除被选中行
    delectAll.onclick = function(){
        var inpRow = tbody.getElementsByTagName('input');
        console.log(inpRow)
        var len = inpRow.length
        for(var i = 0; i < len; i++){
            //点击全选的时候，找到表格主体中被选中的选择框
            if(inpRow[i].checked===true){
                //拿出被选中行的ID里面的数字
                var findId =Number(innerId[i].innerHTML)
                count--;
               //如果被选中要删除的项的ID内容能在数组中找到，就把找到的那一项的ID属性值设置未null
               for(var j = 0; j< aData.length;j++){
                   if(aData[j].ID===findId){
                        aData[j].ID =null;
                   }
               }
            }
        }
        console.log(aData)
        //数据修改之后重新渲染
        render(aData,sortmethod)
        selectAll.checked = false;
        state = false;
        //点击删除之后，页面中没有了选中的项，计数变为0
        // count = 0;
        console.log(inpRow)

        var inpRow = tbody.getElementsByTagName('input');
        //每行的单选按钮点击事件
        clickSelectAll(inpRow)

    }

    //传入渲染的表格主体里面的单选框，计数选中的单选框，控制全选是否选中
    function clickSelectAll(inpRow){
       console.log('传入单选框的长度是'+inpRow.length)
        for(var i = 0; i < inpRow.length; i++){
            inpRow[i].onclick = function(){
                console.log('之前选中走了',count+'个')
                if(this.checked===true){
                    count++;
                }else if(this.checked===false){
                    count--;
                }
                //传入被点击的删除行的单选框 和 剩余在表格主体的信息行的数量 判断全选是否选中
                isSelectAll(this,inpRow.length)
            }
        }
    } 

    //传入被点击的删除行的单选框 和 剩余在表格主体的信息行的数量 判断全选是否选中
    function isSelectAll(node,len){
        // console.log('之前选中走了',count+'个')
        // console.log('这个这个选框选中了吗'+node.checked)
        // console.log('现在还有'+len+'行')
        // console.log('单选框选中'+count+'个')
        if(count===len){
            selectAll.checked = true;
            state =  true;
        }else{
            selectAll.checked = false;
            state =  false;
        }
        // console.log('现在选中走了',count+'个')
    }

    //给表头全选按钮绑定点击事件 点击单选变为全选，点击全选变为单选
    selectAll.onclick = function(){
        if(count!==inpRow.length){//如果单选没有全部选中，说明全选没有选中，点击选中全选让所有的单选按钮是选中状态
            for(var i = 0; i < inpRow.length; i++){
                inpRow[i].checked = true;
            }
            state = true;
            selectAll.checked =  true;
            count=inpRow.length;
        }else{//如果单选都选中，说明全选是选中状态，点击选中取消全选按钮的选中，让所有单选按钮都取消选中
            for(var i = 0; i < inpRow.length; i++){
                inpRow[i].checked = false;
            }
            count = 0;
            state = false;
            selectAll.checked =  false;               
        }
        state != state;
        //console.log(count)
    }



















































}

