import { Component, createRef } from 'react';
import { template } from '../templates/mainView';
import { bindTo, updateLayout, unbindFrom, subscribeToChange, withEvents } from 'databindjs';
import * as $ from 'jquery';
import { MainViewModel } from '../viewModels/mainViewModel';
import { ENTER_KEY } from '../consts';
import { TodoListView } from '../views/todoListView';


class MainView extends withEvents(Component)<any, any> {
    ref = createRef<HTMLElement>();
    createNewItem = null as { exec(); };
    markAllCompletedCommand = null as { exec(); };
    clearCompletedCommand = null as { exec(); };
    itemsListView: TodoListView = null;
    state = {
        total: 0,
        todoCount: 0,
        hasTodos: false,
        toggleAllActive: false,
        manyTasks: false,
        newTodoTitle: '',
        totalText: '0',
        showClearCompleted: false,
        activeFilter: this.props['activeFilter'] as 'active' | 'completed' | ''
    };

    binding = bindTo(this, () => new MainViewModel(), {
        'prop(totalText)': 'items.length',
        'prop(hasTodos)': 'items.length|not',
        '-prop(toggleAllActive)': 'remaining.length|not',
        '-prop(todoCount)': 'remaining.length',
        '-prop(showClearCompleted)': 'completed.length|not',
        '-prop(manyTasks)': 'remaining.1|bool',
        'prop(newTodoTitle)': 'newTodoTitle',
        'itemsListView.items': 'items',
        'itemsListView.filter': 'filterItems',
        '-createNewItem': 'createNewItemCommand',
        'prop(activeFilter)': 'filterBy',
        '-markAllCompletedCommand': 'markAllCompletedCommand',
        '-clearCompletedCommand': 'clearCompletedCommand'
    });

    constructor(props) {
        super(props);
        subscribeToChange(this.binding, () => {
            this.setState({
                ...this.state
            });
        });
    }

    componentDidMount() {
        updateLayout(this.binding);
    }

    componentWillUnmount() {
        unbindFrom(this.binding);
    }

    prop<K extends keyof MainView['state']>(propName: K, val?: MainView['state'][K]): MainView['state'][K] {
        if (arguments.length > 1) {
            this.state[propName] = val;
            this.trigger('change:prop(' + propName + ')');
        }

        return this.state[propName];
    }

    onKeypress(evnt) {
        if (evnt.which === ENTER_KEY) {
            this.createNewItem.exec();
        }
    }

    render() {

        return template(this, this.ref);
    }
}

export { MainView };
