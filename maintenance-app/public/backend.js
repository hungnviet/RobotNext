const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const fileUpload = require("express-fileupload");
const app = express();

app.use(fileUpload());
app.use(cors());
app.use(express.json()); // This middleware is used to parse JSON bodies
const maintenanceRoutes = require("./maintenance.js");
app.use(maintenanceRoutes);
app.listen(3001, () => console.log("Server listening on port12 3001"));

///message BE
app.get("/list_spare_parts_need_to_buy", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/messageDataForBuy.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        res.json(JSON.parse(data));
      }
    }
  );
});

app.delete("/list_spare_parts_need_to_buy", async (req, res) => {
  const messageIdToDelete = req.body.id;

  fs.readFile(
    path.join(__dirname, "../../Data/messageDataForBuy.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let messages = JSON.parse(data);
        const index = messages.findIndex(
          (message) => message.message_id === messageIdToDelete
        );

        if (index !== -1) {
          messages.splice(index, 1);

          fs.writeFile(
            path.join(__dirname, "../../Data/messageDataForBuy.json"),
            JSON.stringify(messages, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Message deleted" });
              }
            }
          );
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Message not found" });
        }
      }
    }
  );
});

///----------------------------------------------------------------------------------------------------------------
///spare part BE

app.get("/list_spare_parts", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/sparePartData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        res.json(JSON.parse(data));
      }
    }
  );
});

app.post("/list_spare_parts", async (req, res) => {
  const newSparePart = req.body.newSparePart;
  fs.readFile(
    path.join(__dirname, "../../Data/sparePartData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let curSparePart = JSON.parse(data);
        const listForCheckExists = curSparePart.filter(
          (item) => item.spare_part_code === newSparePart.spare_part_code
        );
        if (listForCheckExists.length > 0) {
          res
            .status(400)
            .json({ status: "error", message: "Spare part already exists" });
        } else {
          curSparePart.push(newSparePart);
          fs.writeFile(
            path.join(__dirname, "../../Data/sparePartData.json"),
            JSON.stringify(curSparePart, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Spare part added" });
              }
            }
          );
        }
      }
    }
  );
});

app.put("/list_spare_parts", async (req, res) => {
  const updatedSparePart = req.body;
  const {
    spare_part_code,
    new_spare_part_suplier,
    new_delivery_time,
    new_inventory_quantity,
    new_unit_price,
  } = updatedSparePart;

  fs.readFile(
    path.join(__dirname, "../../Data/sparePartData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let curSparePart = JSON.parse(data);
        const index = curSparePart.findIndex(
          (sparePart) => sparePart.spare_part_code === spare_part_code
        );
        if (index !== -1) {
          curSparePart[index].spare_part_suplier = new_spare_part_suplier;
          curSparePart[index].delivery_time = new_delivery_time;
          curSparePart[index].inventory_quantity = new_inventory_quantity;
          curSparePart[index].unit_price = new_unit_price;
          fs.writeFile(
            path.join(__dirname, "../../Data/sparePartData.json"),
            JSON.stringify(curSparePart, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Spare part updated" });
              }
            }
          );
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Spare part not found" });
        }
      }
    }
  );
});

app.delete("/list_spare_parts", async (req, res) => {
  const sparePartCodeToDelete = req.body.spare_part_code;

  fs.readFile(
    path.join(__dirname, "../../Data/sparePartData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let spareParts = JSON.parse(data);
        const index = spareParts.findIndex(
          (sparePart) => sparePart.spare_part_code === sparePartCodeToDelete
        );

        if (index !== -1) {
          spareParts.splice(index, 1);

          fs.writeFile(
            path.join(__dirname, "../../Data/sparePartData.json"),
            JSON.stringify(spareParts, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Spare part deleted" });
              }
            }
          );
        } else {
          res
            .status(404)
            .json({ status: "error", message: "Spare part not found" });
        }
      }
    }
  );
});

///----------------------------------------------------------------------------------------------------------------
///machine BE
app.get("/list_machines", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/machineData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        res.json(JSON.parse(data));
      }
    }
  );
});

app.post("/list_machines", async (req, res) => {
  const newMachine = req.body.newMachine;
  console.log("Received new machine:", newMachine);

  fs.readFile(
    path.join(__dirname, "../../Data/machineData.json"),
    (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        console.log("Sending 500 response for read error");
        return res.status(500).send("Error reading file");
      }
      let curMachine = JSON.parse(data);
      const listForCheckExists = curMachine.filter(
        (item) => item.machine_code === newMachine.machine_code
      );
      if (listForCheckExists.length > 0) {
        console.log("Machine exists, sending 400 response");
        return res
          .status(400)
          .json({ status: "error", message: "Machine already exists" });
      } else {
        curMachine.push(newMachine);
        fs.writeFile(
          path.join(__dirname, "../../Data/machineData.json"),
          JSON.stringify(curMachine, null, 2),
          (err) => {
            if (err) {
              console.error("Error writing file:", err);
              console.log("Sending 500 response for write error");
              return res.status(500).send("Error writing file");
            }
            console.log("Machine added, sending success response");
            res.json({ status: "success", message: "Machine added" });
          }
        );
      }
    }
  );
});

///----------------------------------------------------------------------------------------------------------------
///Each Machine BE

app.get("/machine_detail/:machine_code", (req, res) => {
  const machineCode = req.params.machine_code;
  const filePath = path.join(__dirname, "../../Data/machineData.json");

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading file"); // Exit the function after sending the response
    }

    let machines;
    try {
      machines = JSON.parse(data);
    } catch (parseErr) {
      console.error(parseErr);
      return res.status(500).send("Error parsing JSON data");
    }

    const machine = machines.find(
      (machine) => machine.machine_code === machineCode
    );

    if (machine) {
      return res.json(machine); // Exit the function after sending the response
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Machine not found" }); // Exit the function after sending the response
    }
  });
});

///----------------------------------------------------------------------------------------------------------------
///search Spare Part BE
app.post("/search_spare_parts", (req, res) => {
  const { code, name } = req.body;

  fs.readFile(
    path.join(__dirname, "../../Data/sparePartData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let spareParts = JSON.parse(data);

        // If both code and name are provided, check for exact match on both
        if (code && name) {
          let exactMatchBoth = spareParts.filter((sparePart) => {
            return (
              sparePart.spare_part_code.toLowerCase() === code.toLowerCase() &&
              sparePart.spare_part_name.toLowerCase() === name.toLowerCase()
            );
          });

          if (exactMatchBoth.length > 0) {
            // If there is an exact match on both code and name, return it
            return res.json(exactMatchBoth);
          }
        }

        // If only code is provided, filter by code
        if (code && !name) {
          let resultByCode = spareParts.filter((sparePart) => {
            return sparePart.spare_part_code
              .toLowerCase()
              .includes(code.toLowerCase());
          });
          return res.json(resultByCode);
        }

        // If only name is provided, filter by name
        if (name && !code) {
          let resultByName = spareParts.filter((sparePart) => {
            return sparePart.spare_part_name
              .toLowerCase()
              .includes(name.toLowerCase());
          });
          return res.json(resultByName);
        }

        // If both code and name are provided but no exact match, filter by both
        let result = spareParts.filter((sparePart) => {
          const sparePartCodeMatch = code
            ? sparePart.spare_part_code
                .toLowerCase()
                .includes(code.toLowerCase())
            : true;
          const sparePartNameMatch = name
            ? sparePart.spare_part_name
                .toLowerCase()
                .includes(name.toLowerCase())
            : true;
          return sparePartCodeMatch || sparePartNameMatch;
        });

        res.json(result);
      }
    }
  );
});

///--------------------------------------------Get Specification Template--------------------------------------------------------------------
app.get("/list_specification_template", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/formMachineSpecification.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        res.json(JSON.parse(data));
      }
    }
  );
});

app.post("/list_specification_template", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/formMachineSpecification.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let curTemplate = JSON.parse(data);
        curTemplate.push(req.body);
        fs.writeFile(
          path.join(__dirname, "../../Data/formMachineSpecification.json"),
          JSON.stringify(curTemplate, null, 2),
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error writing file");
            } else {
              res
                .status(200)
                .json({ status: "success", message: "Template added" });
            }
          }
        );
      }
    }
  );
});

app.delete("/list_specification_template", (req, res) => {
  const { machineType } = req.body;

  fs.readFile(
    path.join(__dirname, "../../Data/formMachineSpecification.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let templates = JSON.parse(data);
        console.log("templates", templates);
        const index = templates.findIndex(
          (template) => template.machineType == machineType
        );
        if (index !== -1) {
          templates.splice(index, 1);

          fs.writeFile(
            path.join(__dirname, "../../Data/formMachineSpecification.json"),
            JSON.stringify(templates, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Template deleted" });
              }
            }
          );
        } else {
          console.log("Template not found");
          res
            .status(404)
            .json({ status: "error", message: "Template not found" });
        }
      }
    }
  );
});

app.put("/list_specification_template", (req, res) => {
  const { machineType, listSpecification } = req.body;
  console.log("machineType", machineType);
  console.log("listSpecification", listSpecification);

  fs.readFile(
    path.join(__dirname, "../../Data/formMachineSpecification.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        let templates = JSON.parse(data);
        console.log("templates", templates);
        const index = templates.findIndex(
          (template) => template.machineType == machineType
        );
        if (index !== -1) {
          templates[index].listSpecification = listSpecification;

          fs.writeFile(
            path.join(__dirname, "../../Data/formMachineSpecification.json"),
            JSON.stringify(templates, null, 2),
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).send("Error writing file");
              } else {
                res.json({ status: "success", message: "Template deleted" });
              }
            }
          );
        } else {
          console.log("Template not found");
          res
            .status(404)
            .json({ status: "error", message: "Template not found" });
        }
      }
    }
  );
});

///------------------------------Handle Save Image--------------------------------------------------------------------

// Serve static files from the "Data/image" directory
const imageDir = path.join(__dirname, "../../maintenance-app/public/images");

app.post("/upload_image", (req, res) => {
  const { machineCode } = req.body;
  const images = ["image1", "image2", "image3"];

  if (!machineCode || !req.files) {
    return res
      .status(400)
      .send("Invalid request. Ensure machineCode and images are provided.");
  }

  const imagePaths = [];

  images.forEach((image, index) => {
    if (req.files[image]) {
      const imageFile = req.files[image];
      const imageName = `${machineCode}image${index + 1}${path.extname(
        imageFile.name
      )}`;
      const imagePath = path.join(imageDir, imageName);

      imageFile.mv(imagePath, (err) => {
        if (err) {
          return res.status(500).send(err);
        }
      });

      imagePaths.push(`/images/${imageName}`);
    }
  });

  res.json({
    message: "Images uploaded and paths saved successfully.",
    imagePaths,
  });
});
