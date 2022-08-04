import _ from 'lodash';
import qs from 'query-string';
import { ICradle } from 'src/container';
import moment from 'moment-timezone';

type TFormatAdded = 'day' | 'week' | 'year'; //* Cannot use for month

export const otherHelper = (iCradle: ICradle) => {
    const getFieldValueFromNestedObj = ({
        obj,
        field,
    }: {
        obj: Array<any> | object;
        field: string;
    }) => {
        const nestIds: string[] = [];

        if (!obj) {
            return nestIds;
        }

        const getDataDescendentByKey = (descendentData, field) => {
            if (_.isArray(descendentData)) {
                for (const nestItem of descendentData) {
                    getDataDescendentByKey(nestItem, field);
                }
            }

            if (descendentData[field]) {
                nestIds.push(descendentData[field]);
            }

            if (descendentData.children && descendentData.children.length > 0) {
                for (const descendentItem of descendentData.children) {
                    getDataDescendentByKey(descendentItem, field);
                }
            }
        };

        getDataDescendentByKey(obj, field);

        return nestIds;
    };

    const genUrlCallbackInvite = ({
        workspace_host,
        code,
        organization_id,
        email,
    }: {
        workspace_host: string;
        code: string;
        organization_id?: string;
        email?: string;
    }) => {
        const queries: any = {
            code,
        };
        if (organization_id) {
            queries.organization_id = organization_id;
        }
        if (email) {
            queries.email = email;
        }
        return `https://${workspace_host}/invite?${qs.stringify(queries)}`;
    };

    const validateEmail = (email: string) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.trim().toLowerCase());
    };

    const validatePhoneNumber = (phoneNumber: string | number) => {
        const re =
            /^\+?\(?([\d]{3,4})\)?[-.]?\(?([\d]{3})\)?[-.]?\(?([\d]{4})\)?$/;
        return re.test(String(phoneNumber).trim());
    };

    const changeAlias = (alias: string) => {
        let str = alias;
        if (alias) {
            str = str.toLowerCase();
            str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
            str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
            str = str.replace(/[ìíịỉĩ]/g, 'i');
            str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
            str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
            str = str.replace(/[ỳýỵỷỹ]/g, 'y');
            str = str.replace(/đ/g, 'd');
        }

        return str;
    };

    const changeAliasAndReplaceSpaceToUnderScore = (alias: string) => {
        return changeAlias(alias).replace(/ /g, '_');
    };

    const validateUUID = (string: string) => {
        const regex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        return regex.test(string.trim());
    };

    const matchingValueOfTwoArrays = (arr1: string[], arr2: string[]) => {
        return arr1.filter(element => arr2.includes(element));
    };

    const diffDateTime = (
        fromDate,
        toDate,
        format: string,
        unit: moment.unitOfTime.Diff,
        isFloating: boolean = true,
    ) => {
        return moment(toDate, format).diff(
            moment(fromDate, format),
            unit,
            isFloating,
        );
    };

    const convertHourToMinutes = (time: number) => {
        /**
         * Format time HHmm
         */
        return Math.floor(time / 100) * 60 + (time % 100);
    };

    const formatHour = (time: number) => {
        return String(time).padStart(4, '0');
    };

    const convertSpacesToDashes = (keyword: string) => {
        return keyword.replace(' ', '-');
    };

    const addDateFormat = (
        fromDate: number | string,
        date: number,
        unitOfTime: moment.unitOfTime.DurationConstructor,
        format?: moment.MomentFormatSpecification,
    ) => {
        const fromDateFormat = format ? format : 'YYYYMMDD';
        const data = Number(
            moment(fromDate, fromDateFormat)
                .add(date, unitOfTime)
                .format(String(fromDateFormat)),
        );
        return data;
    };

    const subtractDateFormat = (
        fromDate: number,
        date: number,
        unitOfTime: moment.unitOfTime.DurationConstructor,
        format?: moment.MomentFormatSpecification,
    ) => {
        const fromDateFormat = format ? format : 'YYYYMMDD';
        const data = Number(
            moment(fromDate, fromDateFormat)
                .subtract(date, unitOfTime)
                .format(String(fromDateFormat)),
        );
        return data;
    };

    const isHalfDayFormat = (dateTime: number) => {
        if (!moment(dateTime, 'YYYYMMDDHHmm', true).isValid()) {
            return false;
        }
        const halfDayTimeFormats = ['0000', '1200', '2359'];
        const time = moment(dateTime, 'YYYYMMDDHHmm').format('HHmm');
        return halfDayTimeFormats.includes(time);
    };

    const getDifferenceOfTwoArrays = ({
        old_array: oldArray,
        new_array: newArray,
    }: {
        old_array: Array<string | number>;
        new_array: Array<string | number>;
    }) => {
        const addedItems: Array<string | number> = _.difference(
            newArray,
            oldArray,
        );
        const removedItems: Array<string | number> = _.difference(
            oldArray,
            newArray,
        );

        return {
            added_items: addedItems,
            removed_items: removedItems,
        };
    };

    const generateRangeDates = ({
        from_date,
        valid_date = 0, //* If not existed. Mean unlimited or === 0
        to_date,
        expires_date = 0, //* If not existed. Mean unlimited or === 0
    }: {
        from_date: number;
        to_date: number;
        valid_date?: number;
        expires_date?: number;
    }) => {
        let beginDate: number = from_date;
        let endDate: number = to_date;

        if (valid_date && valid_date > from_date) {
            beginDate = valid_date;
        }

        if (expires_date && expires_date < to_date) {
            endDate = expires_date;
        }

        return {
            begin_date: beginDate,
            end_date: endDate,
        };
    };

    /**
     * ? Note that format added is not right for case Monthly
     * ? EG: If date = 20220130, then add 1 month => the date will become 20220228. And the next date will be 20220328.
     */
    const generateDates = ({
        from_date,
        to_date,
        range_added = 1,
        format_added = 'day',
    }: {
        from_date: number;
        to_date: number;
        range_added?: number;
        format_added?: TFormatAdded;
    }) => {
        const dates: number[] = [];
        for (
            let date = from_date;
            date <= to_date;
            date = addDateFormat(date, range_added, format_added)
        ) {
            dates.push(date);
        }

        return dates;
    };

    const generateDateInMonths = ({
        from_date,
        to_date,
        day_in_month,
        range_added = 1,
    }: {
        from_date: number;
        to_date: number;
        day_in_month: number;
        range_added?: number;
    }) => {
        const formatDate = 'YYYYMMDD';
        let dates: number[] = [];
        const firstDateOfMonth = Number(
            moment(from_date, formatDate).startOf('month').format(formatDate),
        );

        for (
            let date = firstDateOfMonth;
            date <= to_date;
            date = addDateFormat(date, range_added, 'month')
        ) {
            const lastDateOfMonth = Number(
                moment(date, formatDate).endOf('month').format(formatDate),
            );
            const selectedDate = Number(
                moment(date, formatDate).date(day_in_month).format('YYYYMMDD'),
            );

            if (selectedDate <= lastDateOfMonth) {
                dates.push(selectedDate);
            }
        }

        dates = _.uniq(
            dates.filter(date => date >= from_date && date <= to_date),
        );

        return dates;
    };

    const generateDatesInWeek = ({
        from_date,
        to_date,
        range_added = 1,
        format_added = 'day',
        days_in_week,
    }: {
        from_date: number;
        to_date: number;
        range_added?: number;
        format_added?: TFormatAdded;
        days_in_week: number[];
    }) => {
        let dates: number[] = [];

        const datesInWeek = days_in_week.map(dayInWeek =>
            Number(
                moment(from_date, 'YYYYMMDD')
                    .isoWeekday(dayInWeek)
                    .format('YYYYMMDD'),
            ),
        );

        for (const dateInWeek of datesInWeek) {
            dates.push(
                ...generateDates({
                    from_date: dateInWeek,
                    to_date,
                    range_added,
                    format_added,
                }),
            );
        }

        dates = _.uniq(dates.filter(date => date >= from_date));

        return dates;
    };

    /**
     * * Use to get given date of month based on:
     * * 1. From date
     * * 2. Day in week
     * * 3. Week in month
     */
    const getGivenDateOfMonth = ({
        from_date,
        day_in_week,
        week_in_month,
        is_get_last_week,
    }: {
        from_date: number;
        day_in_week: number;
        week_in_month: number;
        is_get_last_week?: boolean;
    }) => {
        const formatDate = 'YYYYMMDD';

        const currentMonth = moment(from_date, formatDate).startOf('month');
        let weekInMonth = week_in_month;

        const firstDayOfWeek = currentMonth.clone().isoWeekday(day_in_week);

        if (firstDayOfWeek.month() != currentMonth.month()) {
            weekInMonth++;
        }

        let givenDate = Number(
            firstDayOfWeek.add(weekInMonth - 1, 'weeks').format(formatDate),
        );
        /**
         * * Check case get last week
         */
        if (is_get_last_week) {
            const nextGivenDate = Number(
                moment(givenDate, formatDate)
                    .add(1, 'weeks')
                    .format(formatDate),
            );

            if (
                moment(nextGivenDate, formatDate).month() ===
                firstDayOfWeek.month()
            ) {
                givenDate = nextGivenDate;
            }
        }

        return givenDate;
    };

    const generateDateInMonth = ({
        from_date,
        to_date,
        day_in_week,
        week_in_month,
        is_get_last_week,
    }: {
        from_date: number;
        to_date: number;
        day_in_week: number;
        week_in_month: number;
        is_get_last_week?: boolean;
    }) => {
        let dates: number[] = [];
        const formatDate = 'YYYYMMDD';

        /**
         * * Because of case from month of current year to month of next year
         * * So need to convert to startDateOfMonth of from_date and to_date
         */
        const startDateOfFromDateMonth = Number(
            moment(from_date, formatDate).startOf('month').format(formatDate),
        );
        const startDateOfToDateMonth = Number(
            moment(to_date, formatDate).startOf('month').format(formatDate),
        );

        for (
            let date = startDateOfFromDateMonth;
            date <= startDateOfToDateMonth;
            date = addDateFormat(date, 1, 'month')
        ) {
            const givenDate = getGivenDateOfMonth({
                from_date: date,
                day_in_week,
                week_in_month,
                is_get_last_week,
            });

            const startOfMonth = Number(
                moment(date, formatDate).startOf('month').format(formatDate),
            );
            const endOfMonth = Number(
                moment(date, formatDate).endOf('month').format(formatDate),
            );

            if (
                startOfMonth <= givenDate &&
                givenDate <= endOfMonth &&
                givenDate >= from_date &&
                givenDate <= to_date
            ) {
                dates.push(givenDate);
            }
        }

        dates = _.uniq(dates);

        return dates;
    };

    const generateLastDateInMonth = ({
        from_date,
        to_date,
    }: {
        from_date: number;
        to_date: number;
    }) => {
        let dates: number[] = [];
        const formatDate = 'YYYYMMDD';

        const startDateOfFromDateMonth = Number(
            moment(from_date, formatDate).startOf('month').format(formatDate),
        );
        const startDateOfToDateMonth = Number(
            moment(to_date, formatDate).startOf('month').format(formatDate),
        );

        for (
            let date = startDateOfFromDateMonth;
            date <= startDateOfToDateMonth;
            date = addDateFormat(date, 1, 'month')
        ) {
            const lastDateOfCurrentMonth = Number(
                moment(date, formatDate).endOf('month').format(formatDate),
            );

            if (
                lastDateOfCurrentMonth >= from_date &&
                lastDateOfCurrentMonth <= to_date
            ) {
                dates.push(lastDateOfCurrentMonth);
            }
        }

        dates = _.uniq(dates);

        return dates;
    };

    const getWeekOfMonth = (date: number) => {
        const result =
            moment(date, 'YYYYMMDD').isoWeek() -
            moment(date, 'YYYYMMDD').startOf('month').isoWeek() +
            1;

        return result < 0 ? moment(date, 'YYYYMMDD').isoWeek() : result;
    };

    const formatNumber = (num: number, dot: string = '.') => {
        const parts = num.toString().split(dot);
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, dot);

        return parts.join(dot);
    };

    const convertToTimestamp = (time: Date) => {
        const formatDate = 'YYYY-MM-DD';
        const dateTimestamp = moment(time, formatDate).format(
            'YYYY-MM-DD HH:mm:ss.SSS',
        );
        return dateTimestamp;
    };

    return {
        getFieldValueFromNestedObj,
        genUrlCallbackInvite,
        validateEmail,
        validatePhoneNumber,
        changeAlias,
        changeAliasAndReplaceSpaceToUnderScore,
        validateUUID,
        matchingValueOfTwoArrays,
        diffDateTime,
        formatHour,
        convertSpacesToDashes,
        addDateFormat,
        subtractDateFormat,
        isHalfDayFormat,
        convertHourToMinutes,
        getDifferenceOfTwoArrays,
        generateRangeDates,
        generateDates,
        generateDateInMonths,
        generateDatesInWeek,
        getGivenDateOfMonth,
        generateDateInMonth,
        generateLastDateInMonth,
        getWeekOfMonth,
        formatNumber,
        convertToTimestamp,
    };
};
