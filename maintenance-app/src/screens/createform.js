import "./createform.css";
function CreateForm() {
  return (
    <div className="update_form_data_screen">
      <div className="header_update_form_template">
        <h3>Input data for maintenance form</h3>
        <div className="filer_update_form_template">
          <div>
            <p>Machine Name</p>
            <input type="text" placeholder="Ex: Toshiba" />
          </div>
          <div>
            <p>Maintenance type</p>
            <select>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Half yearly</option>
              <option>Yearly</option>
            </select>
          </div>
          <button>Find</button>
        </div>
      </div>
      <div className="content_update_form"></div>
    </div>
  );
}

export default CreateForm;
