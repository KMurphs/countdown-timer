import React, {useState} from 'react';
// import './EditableField.css';
import './Input_WithAutoComplete.css';

// var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

type Props = {
  initialContent: string,
  onFieldHandleChange: (newValue: string)=> void,
  getAutoCompleteItemsLike: (content?: string)=> string[]
}

const Input_WithAutoComplete: React.FC<Props> = (props) => {


  // Local Content generated within this component
  // It will persist as long as no new data is force down by the control component
  const [content, setContent] = useState<string>('') 

  // Control whether the auto complete pane is opened or not
  const [isBeingWrittenTo, setIsBeingWrittenTo] = useState<boolean>(false) 

  // Keeps track of the user selection when using up and down arrows
  const [autoCompleteItemsCounter, setAutoCompleteItemsCounter] = useState<number>(-1) 

  // Subset of the Auto Complete items that will be displayed 
  // (because they look like what's already displayed ini the input)
  const [displayedData, setDisplayedData] = useState<string[]>([]) 



  // Read value forced down from control component, and if changed, reinitialize local content to this new value
  const propsInitialContent = props.initialContent || ''
  const [contentFromControlComponent, setContentFromControlComponent] = useState(propsInitialContent)
  if(contentFromControlComponent !== propsInitialContent){
    setContentFromControlComponent(propsInitialContent)
    setContent(propsInitialContent)
  }




  // default input settings
  const fieldOwner = ''
  const fieldName = 'AutoComplete' + new Date().getTime()

  const fieldType = 'text'
  const fieldPattern = ".*"
  const fieldRequired = false

  const fieldTexts = {
    'placeholder': `What are you working on?`,
    'help': `Field Name`, 
    'title': 'Field Name'
  }
  const fieldHandleChange = props.onFieldHandleChange






  // auto complete keydown handler
  var handleAutocompleteKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {


    if(evt.keyCode === 38){
      //arrow DOWN Key pressed
      evt.preventDefault();
      let _autoCompleteItemsCounter = autoCompleteItemsCounter - 1
      setAutoCompleteItemsCounter(_autoCompleteItemsCounter < 0 ? displayedData.length - 1 : _autoCompleteItemsCounter) 


    }else if(evt.keyCode === 40){
      //arrow UP Key pressed
      evt.preventDefault();
      let _autoCompleteItemsCounter = autoCompleteItemsCounter + 1
      setAutoCompleteItemsCounter(_autoCompleteItemsCounter >= displayedData.length ? 0 : _autoCompleteItemsCounter) 


    }else if(evt.keyCode === 13){
      evt.preventDefault();
      if(autoCompleteItemsCounter >= 0 && autoCompleteItemsCounter < displayedData.length){
        // Simulate on click event, Select current entry and display it in the input field
        setContent(displayedData[autoCompleteItemsCounter]); 
        // Close auto complete div
        setIsBeingWrittenTo(false);
        // propagate selection to control/parent component
        fieldHandleChange(displayedData[autoCompleteItemsCounter])
      }else {

          // Enter is pressed because user typed in something
          let _content = content 
          

          // Before assuming that the user want to type something that's not in the autocomplete items
          // First make sure that what's typed in is not in that list
          let index = displayedData.join(':::').toUpperCase().split(':::').indexOf(_content.toUpperCase())
          if(index !== -1){
            _content = displayedData[index]; 
          }

          // Simulate on click event, Select current entry and display it in the input field
          setContent(_content); 
          // Close auto complete div
          setIsBeingWrittenTo(false);
          // propagate selection to control/parent component
          fieldHandleChange(_content)

      }

    }else {

      // For any other character, reopen auto complete div, and reset counter
      setAutoCompleteItemsCounter(-1)
      setIsBeingWrittenTo(true)

      
      // Make a shadow copy of content since the current char has not been affected the input field value or content
      // which mirrors it. We will have to manually build content using the char that's newly entered
      let _content = `${content}` // Shadow copy of content
      if((evt.keyCode >= 48 && evt.keyCode<=111) // all numbers and alphabet
      ||(evt.keyCode >= 186 && evt.keyCode<=222)) // some special chars
      { 
        // Manually add typed chars to shadow copy 
        // _content = `${content}${String.fromCharCode(evt.keyCode)}`
        _content = `${content}${evt.key}`

      }else if(evt.keyCode === 8){
        // Manually perform 'backspace' operation
        _content = `${content.substr(0, content.length - 1)}`

      }else if(evt.keyCode === 46){
        // Manually perform 'delete' operation
        _content = `${content.substr(1)}`

      }
      
      console.log(evt, evt.keyCode, _content, evt.key)

      // Using content's updated shadow copy, filter the data array to only display the relevant entries
      // let _displayedData = _content !== '' ? props.getAutoCompleteItemsLike(_content).filter(item => item.substr(0, _content.length).toUpperCase() === _content.toUpperCase()) : []
      let _displayedData = _content !== '' ? props.getAutoCompleteItemsLike(_content).filter(item => item.toUpperCase().indexOf( _content.toUpperCase()) !== -1) : []
      if(JSON.stringify(_displayedData) !== JSON.stringify(displayedData)){
        // If relevant entries differ from what already on the UI, force a re-render
        setDisplayedData(displayedData => _displayedData)
      }
    }
  }








  // Component JSX/HTML code
  return ( 
    <div className={`input-group-no-borders autocomplete`}>

      <input  type={`${fieldType}`} 
              className="form-control" 
              name={`${fieldName}`} 
              id={`${fieldOwner}-form__${fieldName}`}
              aria-describedby={`${fieldName}Help`} 
              title={fieldTexts.title}
              placeholder={fieldTexts.placeholder}  
              pattern={fieldPattern}  
              onChange={(evt)=>setContent(evt.target.value)} 
              onBlur={(evt)=>setTimeout(()=>setIsBeingWrittenTo(false), 250)}
              value={content}
              autoComplete="off"
              onKeyDown={handleAutocompleteKeyDown}
              required={fieldRequired}/>

      <div id="form-control-autocomplete-list" className="autocomplete-items" style={{'display':`${isBeingWrittenTo?'block':'None'}`}}>
        {
          displayedData
          .map((item, index) => {
            let substrIndex = item.indexOf(content)
            return (
              <div  key={index}
                    className={`${index===autoCompleteItemsCounter?'autocomplete-active':''}`}
                    onClick={(evt)=>{ setContent(item); setIsBeingWrittenTo(false); fieldHandleChange(item) }}> 
                {item.substr(0, substrIndex)}<strong>{content}</strong>{item.substr(substrIndex + content.length)}
              </div>
            )

          }) 
        }
      </div>

    </div>
  )
}
 
export default Input_WithAutoComplete;











const getKeyCodeList = (key: string | number):void => {
  let obj = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shiftleft: 16,
    shiftright: 16,
    ctrlleft: 17,
    ctrlrigght: 17,
    altleft: 18,
    altright: 18,
    pause: 19,
    capslock: 20,
    escape: 27,
    pageup: 33,
    pagedown: 34,
    end: 35,
    home: 36,
    arrowleft: 37,
    arrowup: 38,
    arrowright: 39,
    arrowdown: 40,
    insert: 45,
    delete: 46,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    metaleft: 91,
    metaright: 92,
    select: 93,
    numpad0: 96,
    numpad1: 97,
    numpad2: 98,
    numpad3: 99,
    numpad4: 100,
    numpad5: 101,
    numpad6: 102,
    numpad7: 103,
    numpad8: 104,
    numpad9: 105,
    numpadmultiply: 106,
    numpadadd: 107,
    numpadsubtract: 109,
    numpaddecimal: 110,
    numpaddivide: 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scrolllock: 145,
    semicolon: 186,
    equalsign: 187,
    comma: 188,
    minus: 189,
    period: 190,
    slash: 191,
    backquote: 192,
    bracketleft: 219,
    backslash: 220,
    braketright: 221,
    quote: 222
  };

  // return obj[key];
}