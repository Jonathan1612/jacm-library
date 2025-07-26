import ApiCuentasPorObjetoGasto from '@api/catalogo/ApiCuentasPorObjetoGasto';
import ApiControlGlobal from '@api/catalogo/ApiControlGlobal';
import { ApiError } from '@api/error/ApiError';
import {
  CustomButtonPrimary,
  CustomLoading,
  CustomTableSecundary,
  CustomThSortable,
  mostrarMensaje,
  ocultarMensaje,
  CustomTitle,
  CustomFormDynamicResponsive,
  CustomDialogoConfirmacion,
} from '@components/index';
import { mapToValueLabel } from '@utils/mapper';
import { HttpStatusCode } from 'axios';
import { FormikProps } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { FormSection, ITable, SelectItem } from 'types';
import { useCuentasPorObjetoGastoStore } from '.';
import { useNavigate, useLocation } from 'react-router-dom';
import formBuscarFecha from './formBusquedaFechaCuentaPorObjetoGasto.json';

const CatalogoCuentasPorObjetoGastoPage: React.FC = () => {
  const { resetearFormulario, setField, pageCatalogo, cargando } = useCuentasPorObjetoGastoStore();

  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<any>>(null);
  const [comboFechaEfectiva, setComboFechaEfectiva] = useState<SelectItem[]>([]);
  const [verDialogoConfirmacion, setVerDialogoConfirmacion] = useState(false);

  const location = useLocation();
  const { fechaEfectiva, idObjetoGasto, successMessage } = (location.state ?? {}) as {
    fechaEfectiva?: string;
    idObjetoGasto?: number;
    successMessage?: string;
  };

  console.log(fechaEfectiva)
  console.log(idObjetoGasto)
  console.log(fechaEfectiva)

  const [tableState, setTableState] = useState<ITable>({
    page: 1,
    size: 10,
    columnName: 'objeto_gasto',
    asc: true,
  });

  const sortableHeaders = [
    { label: 'Objeto de Gasto', column: 'objeto_gasto' },
    { label: 'Descripción', column: 'descripcion' },
    { label: 'Costo Año Act', column: 'CAAC.cuenta_contable' },
    { label: 'Costo Año Ant', column: 'CAAN.cuenta_contable' },
    { label: 'Consumo Año Act', column: 'COAAC.cuenta_contable' },
    { label: 'Consumo Año Ant', column: 'COAAN.cuenta_contable' },
    { label: 'Mercancía en Tránsito', column: 'MER.cuenta_contable' },
    { label: 'Almacén Año Act', column: 'AAAC.cuenta_contable' },
    { label: 'Almacén Año Ant', column: 'AAAN.cuenta_contable' },
    { label: 'Deud Ant Emp Año Act', column: 'DGAAC.cuenta_contable' },
    { label: 'Deud Ant Emp Año Ant', column: 'DGAAN.cuenta_contable' },
    { label: 'Deud Glosa Crea Act Ant', column: 'CREA.cuenta_contable' },
    { label: 'Deud Glosa Comp Act Ant', column: 'COMP.cuenta_contable' },
    { label: 'Anticipo a Prove y Contr', column: 'ANT.cuenta_contable' },
  ];

  useEffect(() => {
    if (fechaEfectiva && comboFechaEfectiva.length > 0) {
      const item = comboFechaEfectiva.find((f) => f.label.startsWith(fechaEfectiva));
      if (item) {
        formikRef.current?.setFieldValue('idFechaEfectiva', item.value);
        onBuscar(item.value); // ← aquí se ejecuta solo si viene por navegación
      }
      localStorage.removeItem('cuentasObjetoGasto');
    }
  }, [comboFechaEfectiva]);

  useEffect(() => {
    const inicializarCatalogos = async () => {
      try {
        setField('cargando', true);

        const [catalogoFechaEfectiva, catalogoControlGlobal] = await Promise.all([
          ApiCuentasPorObjetoGasto.comboFechaEfectiva(1),
          ApiControlGlobal.obtenerCombo(),
        ]);

        const mappedCombo = mapToValueLabel(catalogoFechaEfectiva, 'id', 'descripcion');
        setComboFechaEfectiva(mappedCombo);
        setField('catalogoControlGlobal', catalogoControlGlobal);

        let idFecha: string | undefined = '';

        if (idObjetoGasto) {
          const item = mappedCombo.find((f) => Number(f.value) === idObjetoGasto);
          if (item) {
            idFecha = item.value;
          }
        }

        if (!idFecha && fechaEfectiva) {
          const item = mappedCombo.find((f) => f.label.startsWith(fechaEfectiva));
          idFecha = item?.value;
        }

        if (!idFecha && mappedCombo.length > 0) {
          idFecha = mappedCombo[0].value;
        }

        if (idFecha) {
          formikRef.current?.setFieldValue('idFechaEfectiva', idFecha);
          await onBuscar(Number(idFecha));
        }

        localStorage.removeItem('cuentasObjetoGasto');
      } catch (error) {
        if (error instanceof ApiError) {
          mostrarMensaje('danger', error.message);
        }
      } finally {
        setField('cargando', false);
      }
    };

    inicializarCatalogos();

    return () => {
      resetearFormulario();
    };
  }, []);

  const inicializarCatalogos = async () => {
    try {
      setField('cargando', true);

      const catalogoFechaEfectiva = await ApiCuentasPorObjetoGasto.comboFechaEfectiva(1);
      const catalogoControlGlobal = await ApiControlGlobal.obtenerCombo();

      setField('catalogoControlGlobal', catalogoControlGlobal);

      setComboFechaEfectiva(mapToValueLabel(catalogoFechaEfectiva, 'id', 'descripcion'));

      setField('cargando', false);
    } catch (error) {
      if (error instanceof ApiError) {
        mostrarMensaje(error.status !== HttpStatusCode.InternalServerError ? 'warning' : 'danger', error.message);
      }
    } finally {
      setField('cargando', false);
    }
  };

  const onBuscar = async (idFecha?: string | number, customTableState?: ITable) => {
    try {
      setField('cargando', true);
      const idFechaEfectiva = idFecha ?? formikRef.current?.values?.idFechaEfectiva ?? '';
      const state = customTableState ?? tableState;
      const response = await ApiCuentasPorObjetoGasto.buscar({
        idCuentaObjetoGasto: idFechaEfectiva,
        page: state.page,
        size: state.size,
        columnName: state.columnName,
        asc: state.asc,
      });

      setField('pageCatalogo', response.data);
    } catch (error) {
      if (error instanceof ApiError) {
        mostrarMensaje(error.status !== HttpStatusCode.InternalServerError ? 'warning' : 'danger', error.message);
      }
      setField('pageCatalogo', undefined);
    } finally {
      setField('cargando', false);
    }
  };

  const onDescargar = async () => {
    const idFechaEfectiva = formikRef.current?.values?.idFechaEfectiva;

    const idCuentaObjetoGasto = Number(idFechaEfectiva);

    if (!idCuentaObjetoGasto || isNaN(idCuentaObjetoGasto)) {
      return mostrarMensaje('warning', 'Debe seleccionar una Fecha Efectiva válida para descargar.');
    }

    try {
      await ApiCuentasPorObjetoGasto.exportarCSV('cuentasporobjetogasto', {
        idCuentaObjetoGasto,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error instanceof ApiError) {
          mostrarMensaje(error.status !== HttpStatusCode.InternalServerError ? 'warning' : 'danger', error.message);
        }
      }
    }
  };

  const obtenerDescripcionFechaEfectiva = (): string => {
    const idSeleccionado = formikRef.current?.values?.idFechaEfectiva;
    const fecha = comboFechaEfectiva.find((fecha) => fecha.value === idSeleccionado);
    return fecha?.label?.split('-')[0]?.trim() ?? 'seleccionada';
  };

  const onEliminar = async () => {
    const idFechaEfectiva = formikRef.current?.values?.idFechaEfectiva;
    const idCuentaObjetoGasto = Number(idFechaEfectiva);

    if (!idCuentaObjetoGasto || isNaN(idCuentaObjetoGasto)) {
      return mostrarMensaje('warning', 'Debe seleccionar una Fecha Efectiva válida para eliminar.');
    }

    try {
      const response = await ApiCuentasPorObjetoGasto.eliminar(idCuentaObjetoGasto);
      mostrarMensaje('success', response.message);

      // Recargar combo actualizado
      const nuevasFechas = await ApiCuentasPorObjetoGasto.comboFechaEfectiva(1);
      const nuevoCombo = mapToValueLabel(nuevasFechas, 'id', 'descripcion');
      setComboFechaEfectiva(nuevoCombo);

      // Si hay al menos una fecha, seleccionar la primera y hacer búsqueda
      if (nuevoCombo.length > 0) {
        const nuevaFecha = nuevoCombo[0].value;
        formikRef.current?.setFieldValue('idFechaEfectiva', nuevaFecha);
        await onBuscar(nuevaFecha);
      } else {
        // No hay fechas, limpiar tabla
        setField('pageCatalogo', undefined);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        mostrarMensaje(error.status !== HttpStatusCode.InternalServerError ? 'warning' : 'danger', error.message);
      }
    }
  };

  const onEditar = () => {
    ocultarMensaje();

    const idFechaEfectiva = formikRef.current?.values?.idFechaEfectiva;
    const fechaCompleta = comboFechaEfectiva.find((fecha) => fecha.value === idFechaEfectiva)?.label ?? '';
    const fechaEfectivaSeleccionada = fechaCompleta.split('-')[0]?.trim();

    if (!fechaEfectivaSeleccionada || !idFechaEfectiva) {
      return mostrarMensaje('warning', 'Debe seleccionar una Fecha Efectiva y una fila para editar.');
    }

    navigate('/contabilidad-general/catalogos/operacion/cuentas-objeto-gasto/editar-fecha-efectiva', {
      state: {
        fechaEfectiva: fechaEfectivaSeleccionada,
        idObjetoGasto: idFechaEfectiva,
      },
    });
  };

  const onAgregar = () => {
    ocultarMensaje();
    navigate('/contabilidad-general/catalogos/operacion/cuentas-objeto-gasto/agregar-fecha-efectiva', {});
  };

  const mostrarValor = (valor: any) => {
    if (valor == null) return '';
    if (typeof valor === 'object') {
      return valor.descripcion ?? valor.label ?? JSON.stringify(valor);
    }
    return valor.toString();
  };

  useEffect(() => {
    if (successMessage) {
      console.log('Mostrando mensaje de éxito:', successMessage); // LOG DE DEPURACIÓN
      mostrarMensaje('success', successMessage);
      // Limpiar el mensaje del state para que no se repita si navegas de nuevo
      window.history.replaceState({ ...window.history.state, usr: { ...location.state, successMessage: undefined } }, '');
    } else {
      console.log('No hay successMessage en location.state:', location.state); // LOG DE DEPURACIÓN
    }
  }, [successMessage]);

  return (
    <Container>
      {cargando && <CustomLoading />}

      <div className="pb-3">
        <CustomTitle title="Cuentas por Objeto de Gasto" />
      </div>

      <CustomDialogoConfirmacion
        title="Eliminar fecha efectiva"
        message={`¿Está seguro de eliminar la fecha efectiva ${obtenerDescripcionFechaEfectiva()}?`}
        cancelLabel="Cancelar"
        confirmLabel="Aceptar"
        order={2}
        show={verDialogoConfirmacion}
        onCancel={() => setVerDialogoConfirmacion(false)}
        onConfirm={async () => {
          await onEliminar();
          setVerDialogoConfirmacion(false);
        }}
      />

      <CustomFormDynamicResponsive
        innerRef={formikRef}
        sections={formBuscarFecha as FormSection[]}
        selectOptions={{ idFechaEfectiva: comboFechaEfectiva }}
        initialValues={{ idControlGlobal: 'SATMX', idFechaEfectiva: '' }}
        onChange={(name, value) => {
          if (name === 'idFechaEfectiva') {
            if (value) {
              onBuscar(Number(value));
            } else {
              setField('pageCatalogo', undefined);
            }
          }
        }}
      />

      <div className="text-end mt-4 mb-4">
        <CustomButtonPrimary className="me-4" onClick={onAgregar}>
          Agregar nueva fecha efectiva
        </CustomButtonPrimary>
        <CustomButtonPrimary onClick={onEditar}>Editar por fecha efectiva</CustomButtonPrimary>
      </div>

      <CustomTableSecundary
        data={pageCatalogo?.content ?? []}
        totalItems={pageCatalogo?.numberOfElements ?? 0}
        itemsPerPage={tableState.size}
        currentPage={tableState.page}
        onPageChange={(page, size) => {
          const newState = { ...tableState, page, size };
          setTableState(newState);
          onBuscar(undefined, newState);
        }}
        onItemsPerPageChange={(size) => {
          const newState = { ...tableState, page: 1, size };
          setTableState(newState);
          onBuscar(undefined, newState);
        }}
        headers={
          <>
            <CustomThSortable
              headers={sortableHeaders}
              currentColumn={tableState.columnName}
              asc={tableState.asc}
              onSort={({ columnName, asc }) => {
                const newState = { ...tableState, columnName, asc, page: 1 };
                setTableState(newState);
                onBuscar(undefined, newState);
              }}
            />
          </>
        }
        renderItem={(item) => (
          <>
            <td>{mostrarValor(item.objetoGasto)}</td>
            <td>{mostrarValor(item.descripcion)}</td>
            <td>{mostrarValor(item.costoAnioAct)}</td>
            <td>{mostrarValor(item.costoAnioAnt)}</td>
            <td>{mostrarValor(item.consumoAnioAct)}</td>
            <td>{mostrarValor(item.consumoAnioAnt)}</td>
            <td>{mostrarValor(item.mercanciasTransito)}</td>
            <td>{mostrarValor(item.almacenAnioAct)}</td>
            <td>{mostrarValor(item.almacenAnioAnt)}</td>
            <td>{mostrarValor(item.deudAntEmpAnioAct)}</td>
            <td>{mostrarValor(item.deudAntEmpAnioAnt)}</td>
            <td>{mostrarValor(item.deudGlosaCreaActAnt)}</td>
            <td>{mostrarValor(item.deudGlosaCompActAnt)}</td>
            <td>{mostrarValor(item.anticipoProveContr)}</td>
          </>
        )}
      />
      <div className="text-end">
        <CustomButtonPrimary
          className="me-5"
          disabled={pageCatalogo === undefined}
          onClick={() => setVerDialogoConfirmacion(true)}>
          Eliminar fecha efectiva
        </CustomButtonPrimary>
        <CustomButtonPrimary disabled={pageCatalogo === undefined} onClick={onDescargar}>
          Descargar
        </CustomButtonPrimary>
      </div>
    </Container>
  );
};

export default CatalogoCuentasPorObjetoGastoPage;